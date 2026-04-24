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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubcategoryController = void 0;
const CreateSubcategoryService_1 = require("../../services/subcategoires/CreateSubcategoryService");
class CreateSubcategoryController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId, name } = req.body;
            try {
                const createSubcategoryService = new CreateSubcategoryService_1.CreateSubcategoryService();
                const subcategory = yield createSubcategoryService.execute({ categoryId: Number(categoryId), name });
                return res.status(201).json(subcategory);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CreateSubcategoryController = CreateSubcategoryController;
