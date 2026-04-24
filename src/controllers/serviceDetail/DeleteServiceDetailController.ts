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
exports.DeleteServiceDetailController = void 0;
const DeleteServiceDetailService_1 = require("../../services/serviceDetail/DeleteServiceDetailService");
class DeleteServiceDetailController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, detailId } = req.params;
            const userId = req.user_id;
            try {
                const deleteServiceDetailService = new DeleteServiceDetailService_1.DeleteServiceDetailService();
                yield deleteServiceDetailService.execute({
                    serviceId: Number(serviceId),
                    detailId: Number(detailId),
                    userId,
                });
                return res.status(204).send();
            }
            catch (error) {
                console.error("Erro no DeleteServiceDetailController:", error);
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.DeleteServiceDetailController = DeleteServiceDetailController;
