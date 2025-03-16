import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from "./routes/analytics.route.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const PORT = process.env.PORT || 5000; // Adicionando a definição de PORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar o app Express
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());


// Rotas da API
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === "production") {
  // Ajuste o caminho para alcançar a pasta dist do frontend
  const frontendPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Para ambiente não-Vercel (desenvolvimento local)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("server is running on http://localhost:" + PORT);
    connectDB();
  });
} else {
  // Conectar ao banco de dados em ambiente de produção Vercel
  connectDB();
}

// Exportar o app para uso com serverless na Vercel
export default app;