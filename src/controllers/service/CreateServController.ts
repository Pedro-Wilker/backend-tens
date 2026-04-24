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
exports.CreateServiceController = void 0;
const CreateServService_1 = require("../../services/service/CreateServService");
class CreateServiceController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { providerId, subcategoryId, name, description, price } = req.body;
            const createServiceService = new CreateServService_1.CreateServiceService();
            try {
                const service = yield createServiceService.execute({ providerId: Number(providerId), subcategoryId: Number(subcategoryId), name, description, price });
                return res.status(201).json(service);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CreateServiceController = CreateServiceController;
