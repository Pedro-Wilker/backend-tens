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
exports.UpdateSubcategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateSubcategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subcategoryId, name }) {
            if (!subcategoryId) {
                throw new Error("Subcategory ID is required");
            }
            if (!name) {
                throw new Error("Name must be provided to update");
            }
            const subcategory = yield prisma_1.default.subcategory.findUnique({
                where: { id: subcategoryId },
            });
            if (!subcategory) {
                throw new Error("Subcategory not found");
            }
            if (name && name !== subcategory.name) {
                const subcategoryAlreadyExists = yield prisma_1.default.subcategory.findFirst({
                    where: { name, categoryId: subcategory.categoryId },
                });
                if (subcategoryAlreadyExists) {
                    throw new Error("Subcategory name already exists in this category");
                }
            }
            const updatedSubcategory = yield prisma_1.default.subcategory.update({
                where: { id: subcategoryId },
                data: {
                    name,
                },
            });
            return {
                id: updatedSubcategory.id,
                name: updatedSubcategory.name,
                categoryId: updatedSubcategory.categoryId,
                createdAt: updatedSubcategory.createdAt,
                updatedAt: updatedSubcategory.updatedAt,
            };
        });
    }
}
exports.UpdateSubcategoryService = UpdateSubcategoryService;
