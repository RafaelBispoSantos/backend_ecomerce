import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

const setCookies = (res, accessToken, refreshToken) => {
    // Aqui estava o erro: usando 'token' em vez de 'accessToken'
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });
    
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Alterado para 'none' em produção para funcionar com CORS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: '/'
    });
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: 'User created successfully'
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
       const { email, password } = req.body;
 
       // Verifica se o corpo da requisição contém email e senha
       if (!email || !password) {
          console.log("Missing email or password in the request body");
          return res.status(400).json({ message: "Email and password are required" });
       }
 
       console.log(`Attempting login for user: ${email}`);
 
       // Verifica se o usuário existe no banco de dados
       const user = await User.findOne({ email });
       if (!user) {
          console.log(`User not found: ${email}`);
          return res.status(401).json({ message: "Invalid credentials" });
       }
       console.log(`User found: ${user._id}`);
 
       // Verifica se a senha está correta
       const isPasswordValid = await user.comparePassword(password);
       if (!isPasswordValid) {
          console.log(`Invalid password for user: ${email}`);
          return res.status(401).json({ message: "Invalid credentials" });
       }
 
       console.log(`Password is valid for user: ${email}`);
 
       // Gera os tokens de acesso e refresh
       const { accessToken, refreshToken } = generateToken(user._id);
       console.log(`Generated accessToken and refreshToken for user: ${email}`);
 
       // Armazena o refreshToken no Redis
       await storeRefreshToken(user._id, refreshToken);
       console.log(`Stored refreshToken in Redis for user: ${user._id}`);
 
       // Configura os cookies com os tokens
       setCookies(res, accessToken, refreshToken);
       console.log("Cookies set with accessToken and refreshToken");
 
       // Responde com os dados do usuário
       res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
       });
 
    } catch (error) {
       console.log("Error in login controller:", error.message);
       res.status(500).json({ message: error.message });
    }
};
 
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        // Use as mesmas configurações dos cookies para limpá-los corretamente
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
        
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const refreshTokens = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        // Verifique se o token de atualização ainda é válido
        if (refreshToken !== storedToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Gere um novo accessToken
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // Atualize o cookie com o novo accessToken usando a função setCookies
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000, // 15 minutos
        });

        // Opcional: Retorne o novo token no corpo da resposta
        res.json({
            message: "Tokens refreshed successfully",
            accessToken
        });
    } catch (error) {
        console.error("Error in refreshTokens controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error in getProfile controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};