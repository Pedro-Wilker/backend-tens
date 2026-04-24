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
exports.UpdateSubcategoryController = void 0;
const UpdateSubcategoryService_1 = require("../../services/subcategoires/UpdateSubcategoryService");
class UpdateSubcategoryController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcategoryId } = req.params;
            const { name } = req.body;
            try {
                const updateSubcategoryService = new UpdateSubcategoryService_1.UpdateSubcategoryService();
                const updatedSubcategory = yield updateSubcategoryService.execute({ subcategoryId: Number(subcategoryId), name });
                return res.status(200).json(updatedSubcategory);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateSubcategoryController = UpdateSubcategoryController;
