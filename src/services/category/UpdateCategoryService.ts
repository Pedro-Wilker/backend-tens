"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isProduction = process.env.NODE_ENV === "production";
const uploadDir = process.env.UPLOAD_DIR || (isProduction ? "/public_html/uploads" : path_1.default.join(process.cwd(), "uploads"));
class UpdateCategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, file }) {
            if (!id)
                throw new Error("Category ID is required");
            const category = yield prisma_1.default.category.findUnique({ where: { id } });
            if (!category)
                throw new Error("Category not found");
            let newImageUrl = category.imageUrl;
            if (file) {
                if (category.imageUrl) {
                    const oldImagePath = path_1.default.join(uploadDir, category.imageUrl);
                    if (fs_1.default.existsSync(oldImagePath)) {
                        fs_1.default.unlinkSync(oldImagePath);
                    }
                }
                newImageUrl = file.filename;
            }
            if (name && name !== category.name) {
                const nameExists = yield prisma_1.default.category.findFirst({ where: { name } });
                if (nameExists && nameExists.id !== id)
                    throw new Error("Category name already in use by another category");
            }
            const updatedCategory = yield prisma_1.default.category.update({
                where: { id },
                data: {
                    name: name !== null && name !== void 0 ? name : category.name,
                    imageUrl: newImageUrl,
                },
            });
            return Object.assign(Object.assign({}, updatedCategory), { imageUrl: `/uploads/${updatedCategory.imageUrl}`.replace("//", "/") });
        });
    }
}
exports.UpdateCategoryService = UpdateCategoryService;
