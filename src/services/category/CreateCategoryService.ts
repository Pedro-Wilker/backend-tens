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
exports.CreateCategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const isProduction = process.env.NODE_ENV === "production";
class CreateCategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, file }) {
            if (!name) {
                throw new Error("Category name is required");
            }
            if (!file) {
                throw new Error("Image is required");
            }
            const categoryAlreadyExists = yield prisma_1.default.category.findFirst({
                where: { name },
            });
            if (categoryAlreadyExists) {
                throw new Error("Category already exists");
            }
            const category = yield prisma_1.default.category.create({
                data: {
                    name,
                    imageUrl: file.filename,
                },
            });
            return Object.assign(Object.assign({}, category), { imageUrl: `/uploads/${category.imageUrl}`.replace("//", "/") });
        });
    }
}
exports.CreateCategoryService = CreateCategoryService;
