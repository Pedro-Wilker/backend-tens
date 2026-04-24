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
exports.UpdateServiceController = void 0;
const UpdateServiceService_1 = require("../../services/service/UpdateServiceService");
class UpdateServiceController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId } = req.params;
            const { name, description, price, subcategoryId } = req.body;
            try {
                const updateServiceService = new UpdateServiceService_1.UpdateServiceService();
                const updatedService = yield updateServiceService.execute({
                    serviceId: Number(serviceId),
                    name,
                    description,
                    price,
                    subcategoryId: Number(subcategoryId),
                });
                return res.status(200).json(updatedService);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateServiceController = UpdateServiceController;
