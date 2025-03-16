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
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax",
        maxAge: 15 * 60 * 1000, // 15 minutos
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
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
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
   try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.comparePassword(password))){
        const {accessToken, refreshToken} = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    }
    else{
        res.status(401).json({ message: "Invalid credentials" });
    }

   } catch (error) {
    console.log("Error in login controller", error.message);
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

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const refreshTokens = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token; // Certifique-se de que o nome corresponde ao definido em setCookies

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

        // Atualize o cookie com o novo accessToken
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
