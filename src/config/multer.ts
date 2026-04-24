"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const isProduction = process.env.NODE_ENV === "production";
const uploadPath = isProduction
    ? "/home5/tenso3105817/public_html/uploads"
    : (0, path_1.resolve)(process.cwd(), "uploads");
const multerConfig = {
    upload() {
        const folder = process.env.UPLOAD_DIR || uploadPath;
        if (!fs_1.default.existsSync(folder)) {
            try {
                fs_1.default.mkdirSync(folder, { recursive: true });
                console.log(`Diretório ${folder} criado com sucesso.`);
            }
            catch (err) {
                console.error(`Erro ao criar diretório ${folder}:`, err);
                throw new Error(`Não foi possível criar o diretório ${folder}: ${err.message}`);
            }
        }
        try {
            fs_1.default.accessSync(folder, fs_1.default.constants.W_OK);
            console.log(`Permissão de escrita confirmada em ${folder}.`);
        }
        catch (err) {
            console.error(`Sem permissão de escrita em ${folder}:`, err);
            throw new Error(`Sem permissão de escrita em ${folder}: ${err.message}`);
        }
        return {
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, folder);
                },
                filename: (req, file, cb) => {
                    const fileHash = crypto_1.default.randomBytes(8).toString("hex");
                    const timestamp = Date.now();
                    const fileName = `${timestamp}-${fileHash}-${file.originalname.replace(/\s+/g, "-")}`;
                    cb(null, fileName);
                },
            }),
            limits: {
                fileSize: 20 * 1024 * 1024,
                files: 10,
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes = /jpeg|jpg|png|svg|webp/;
                const extnameCheck = allowedTypes.test((0, path_1.extname)(file.originalname).toLowerCase());
                const mimetypeCheck = allowedTypes.test(file.mimetype);
                if (extnameCheck && mimetypeCheck) {
                    cb(null, true);
                }
                else {
                    cb(new Error("Apenas JPEG, JPG, PNG, SVG e WEBP são permitidos."));
                }
            },
        };
    },
};
exports.default = multerConfig;
