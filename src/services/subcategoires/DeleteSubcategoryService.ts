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
exports.DeleteSubcategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteSubcategoryService {
    execute(subcategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcategory = yield prisma_1.default.subcategory.findUnique({
                where: { id: subcategoryId },
                include: { services: true },
            });
            if (!subcategory) {
                throw new Error("Subcategory not found");
            }
            if (subcategory.services.length > 0) {
                throw new Error("Cannot delete subcategory with associated services");
            }
            yield prisma_1.default.subcategory.delete({
                where: { id: subcategoryId },
            });
            return { message: "Subcategory deleted successfully" };
        });
    }
}
exports.DeleteSubcategoryService = DeleteSubcategoryService;
