import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL); // Sem opções adicionais
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); // Encerra o processo em caso deerro crítico
  }
};
