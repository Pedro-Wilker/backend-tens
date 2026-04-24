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
exports.ListSubcategoriesByNameController = void 0;
const ListSubcategoriesByNameService_1 = require("../../services/subcategoires/ListSubcategoriesByNameService");
class ListSubcategoriesByNameController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            try {
                const listSubcategoriesByNameService = new ListSubcategoriesByNameService_1.ListSubcategoriesByNameService();
                const subcategories = yield listSubcategoriesByNameService.execute(name);
                return res.status(200).json(subcategories);
            }
            catch (error) {
                return res.status(404).json({ error: error.message });
            }
        });
    }
}
exports.ListSubcategoriesByNameController = ListSubcategoriesByNameController;
