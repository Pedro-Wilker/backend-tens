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
exports.ListServicesByCategoryController = void 0;
const ListServicesByCategoryService_1 = require("../../services/service/ListServicesByCategoryService");
class ListServicesByCategoryController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            const listServicesByCategoryService = new ListServicesByCategoryService_1.ListServicesByCategoryService();
            try {
                const services = yield listServicesByCategoryService.execute(Number(categoryId));
                return res.json(services);
            }
            catch (error) {
                if (error.message === 'Category not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
}
exports.ListServicesByCategoryController = ListServicesByCategoryController;
