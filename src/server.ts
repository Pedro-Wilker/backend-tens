import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import { router } from './routes';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: false, 
}));

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL as string,
    "https://vossa-app-na-vercel.app" 
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadDir));

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error."
    });
});

const PORT = process.env.PORT || 3333;

async function start() {
    try {
        await prisma.$connect();
        console.log("🚀 Prisma conectado ao Postgres!");
        
        app.listen(PORT, () => {
            console.log(`🔥 Server rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco:", error);
        process.exit(1);
    }
}

start();