import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Ajuste aqui para usar o nome correto do cookie
    const token = req.cookies.access_token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Nenhum token fornecido. Cookies:', req.cookies, 'Headers:', req.headers);
      return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access danied - Admin only" });
  }
};