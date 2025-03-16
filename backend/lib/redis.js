import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Verificar se a variável de ambiente está definida
const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  console.error("ERRO: Variável de ambiente UPSTASH_REDIS_URL não está definida!");
  // Dependendo do seu caso de uso, você pode querer encerrar o processo aqui
  // process.exit(1);
}

// Opções adicionais para melhorar a resiliência da conexão
const options = {
  maxRetriesPerRequest: null, // Evita o erro MaxRetriesPerRequestError
  retryStrategy: (times) => {
    // Estratégia de reconexão exponencial com limite máximo
    const delay = Math.min(times * 100, 3000);
    return delay;
  }
};

export const redis = new Redis(redisUrl, options);

// Adicione manipuladores de eventos para monitorar a conexão
redis.on("error", (err) => {
  console.error("Erro na conexão Redis:", err);
});

redis.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!");
});

// Exemplo de uso (você pode remover isso se for desnecessário)
try {
  await redis.set('foo', 'booo');
  console.log("Valor definido com sucesso!");
} catch (error) {
  console.error("Erro ao definir valor no Redis:", error);
}