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
exports.DeleteServiceDetailService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DeleteServiceDetailService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId, detailId, userId }) {
            if (!serviceId || !detailId) {
                throw new Error("Service ID and Detail ID are required");
            }
            const serviceDetail = yield prisma_1.default.serviceDetail.findUnique({
                where: { id: detailId, serviceId },
                include: { service: { include: { provider: true } } },
            });
            if (!serviceDetail) {
                throw new Error("Service detail not found");
            }
            if (serviceDetail.service.providerId !== Number(userId)) {
                throw new Error("You are not authorized to delete this service detail");
            }
            if (serviceDetail.photoUrl) {
                const uploadDir = path_1.default.resolve(__dirname, "..", "..", "uploads");
                const fileName = serviceDetail.photoUrl.split("/").pop() || serviceDetail.photoUrl;
                const imagePath = path_1.default.join(uploadDir, fileName);
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            yield prisma_1.default.serviceDetail.delete({
                where: { id: detailId },
            });
        });
    }
}
exports.DeleteServiceDetailService = DeleteServiceDetailService;
