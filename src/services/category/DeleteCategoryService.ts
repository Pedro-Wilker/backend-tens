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
exports.DeleteCategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteCategoryService {
    execute(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.category.findUnique({
                where: { id: categoryId },
                include: { subcategories: true },
            });
            if (!category) {
                throw new Error("Category not found");
            }
            const hasServices = yield prisma_1.default.service.findFirst({
                where: {
                    subcategoryId: {
                        in: category.subcategories.map((sub) => sub.id),
                    },
                },
            });
            if (hasServices) {
                throw new Error("Cannot delete category with subcategories that have services");
            }
            yield prisma_1.default.category.delete({
                where: { id: categoryId },
            });
            return { message: "Category deleted successfully" };
        });
    }
}
exports.DeleteCategoryService = DeleteCategoryService;
