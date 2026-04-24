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
exports.UpdateCategoryController = void 0;
const UpdateCategoryService_1 = require("../../services/category/UpdateCategoryService");
class UpdateCategoryController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            const { name } = req.body;
            const file = req.file;
            try {
                const updateCategoryService = new UpdateCategoryService_1.UpdateCategoryService();
                const updatedCategory = yield updateCategoryService.execute({
                    id: Number(categoryId),
                    name: name || undefined,
                    file,
                });
                return res.status(200).json(updatedCategory);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateCategoryController = UpdateCategoryController;
