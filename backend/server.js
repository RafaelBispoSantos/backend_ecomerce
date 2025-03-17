import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Inicializar o app Express
const app = express();

// Configurar CORS
const corsOptions = {
  origin: [
    'http://localhost:5173', // Frontend em desenvolvimento
    //'https://frontend-seu-dominio.com', // Substitua pela URL do frontend em produção
  ],
  credentials: true, // Permitir cookies e cabeçalhos de autenticação
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());

// Conectar ao banco de dados
connectDB();

// Configurar Redis com ioredis
const redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false, // Configuração necessária para conexões seguras no Upstash
  },
});

redisClient.on('connect', () => console.log('Conectado ao Redis com ioredis com sucesso!'));
redisClient.on('error', (err) => console.error('Erro ao conectar ao Redis com ioredis:', err));

// Testar conexão com Redis
app.get('/api/test-redis', async (req, res) => {
  try {
    const testKey = 'test-key';
    const testValue = 'test-value';

    // Testar set e get
    await redisClient.set(testKey, testValue);
    const value = await redisClient.get(testKey);

    res.status(200).json({ message: 'Redis está funcionando com ioredis!', value });
  } catch (error) {
    console.error('Erro ao conectar ao Redis com ioredis:', error);
    res.status(500).json({ error: 'Erro ao conectar ao Redis com ioredis', details: error.message });
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Adicionar uma rota básica para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Verificação se estamos no ambiente Vercel
const isVercel = process.env.VERCEL === '1';

// Iniciar o servidor se não estivermos no Vercel
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`Em produção: https://ecommerce-story-api.onrender.com`);
    } else {
      console.log(`Em desenvolvimento: http://localhost:${PORT}`);
    }
  });
}

// Exportar o app para uso com serverless na Vercel
export default app;
