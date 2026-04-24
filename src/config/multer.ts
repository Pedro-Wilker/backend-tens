import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads');

export default {
  upload() {
    return {
      storage: multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString('hex');
          const fileName = `${fileHash}-${file.originalname}`;
          
          return callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error("Tipo de arquivo não permitido"));
        }
      },
    };
  },
};