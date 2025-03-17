import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import { redis } from './lib/redis.js'; // Importar a instância Redis já configurada
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Inicializar o app Express
const app = express();

// Configurar CORS com base no ambiente
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://frontend-ecommerce-mu-six.vercel.app/',
      ]
    : [ 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Middleware para processar JSON e cookies
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());

// Conectar ao banco de dados
connectDB();

// Middleware para depuração (em ambiente não-produção)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Cookies:', req.cookies);
    next();
  });
}

// Testar conexão com Redis
app.get('/api/test-redis', async (req, res) => {
  try {
    const testKey = 'test-key';
    const testValue = 'test-value';
    
    // Testar set e get
    await redis.set(testKey, testValue);
    const value = await redis.get(testKey);
    
    res.status(200).json({ message: 'Redis está funcionando!', value });
  } catch (error) {
    console.error('Erro ao testar Redis:', error);
    res.status(500).json({ error: 'Erro ao conectar ao Redis', details: error.message });
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Rota de verificação de saúde da API
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API está funcionando',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Verificação se estamos no ambiente Vercel
const isVercel = process.env.VERCEL === '1';

// Iniciar o servidor se não estivermos no Vercel
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`Em produção: https://backend-ecomerce-v2t8.onrender.com`);
    } else {
      console.log(`Em desenvolvimento: http://localhost:${PORT}`);
    }
  });
}

// Exportar o app para uso com serverless na Vercel
export default app;