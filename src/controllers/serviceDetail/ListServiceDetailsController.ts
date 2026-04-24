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
exports.ListServiceDetailsController = void 0;
const ListServiceDetailsService_1 = require("../../services/serviceDetail/ListServiceDetailsService");
class ListServiceDetailsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId } = req.params;
            const listServiceDetailsService = new ListServiceDetailsService_1.ListServiceDetailsService();
            try {
                const serviceDetails = yield listServiceDetailsService.execute(Number(serviceId));
                return res.json(serviceDetails);
            }
            catch (error) {
                return res.status(404).json({ error: error.message });
            }
        });
    }
}
exports.ListServiceDetailsController = ListServiceDetailsController;
