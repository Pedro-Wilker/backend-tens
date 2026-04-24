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
exports.CreateServiceDetailController = void 0;
const CreateSDService_1 = require("../../services/serviceDetail/CreateSDService");
const multer_1 = __importDefault(require("../../config/multer"));
const upload = multer_1.default.upload();
class CreateServiceDetailController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, description } = req.body;
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ error: "No files uploaded" });
            }
            const photoDetails = files.map((file) => ({
                file,
                description: description || undefined,
            }));
            const createServiceDetailService = new CreateSDService_1.CreateServiceDetailService();
            try {
                const serviceDetail = yield createServiceDetailService.execute({
                    serviceId: Number(serviceId),
                    photoDetails,
                });
                return res.status(201).json(serviceDetail);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CreateServiceDetailController = CreateServiceDetailController;
