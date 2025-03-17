// backend/lib/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Verificar se a variável de ambiente está definida
const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  console.error("ERRO: Variável de ambiente UPSTASH_REDIS_URL não está definida!");
  process.exit(1); // Encerra o processo se a URL não estiver definida
}

// Opções de conexão para melhorar a resiliência
const options = {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Estratégia de reconexão exponencial com limite máximo de 3 segundos
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  // Adicionando opções de TLS para Upstash
  tls: {
    rejectUnauthorized: false
  }
};

// Criar uma única instância Redis
const redis = new Redis(redisUrl, options);

// Manipuladores de eventos para monitorar a conexão
redis.on("error", (err) => {
  console.error("Erro na conexão Redis:", err);
});

redis.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!");
});

redis.on("reconnecting", () => {
  console.log("Reconectando ao Redis...");
});

// Exportar uma única instância do Redis
export { redis };