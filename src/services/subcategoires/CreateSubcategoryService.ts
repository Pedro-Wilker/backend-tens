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
exports.CreateSubcategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateSubcategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, name }) {
            if (!categoryId) {
                throw new Error("Category ID is required");
            }
            if (!name) {
                throw new Error("Subcategory name is required");
            }
            const categoryExists = yield prisma_1.default.category.findUnique({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                throw new Error("Category not found");
            }
            const subcategoryAlreadyExists = yield prisma_1.default.subcategory.findFirst({
                where: { name, categoryId },
            });
            if (subcategoryAlreadyExists) {
                throw new Error("Subcategory name already exists in this category");
            }
            const subcategory = yield prisma_1.default.subcategory.create({
                data: {
                    name,
                    categoryId,
                },
            });
            return {
                id: subcategory.id,
                name: subcategory.name,
                categoryId: subcategory.categoryId,
                createdAt: subcategory.createdAt,
                updatedAt: subcategory.updatedAt,
            };
        });
    }
}
exports.CreateSubcategoryService = CreateSubcategoryService;
