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
exports.GetServiceDetailService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetServiceDetailService {
    execute(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!serviceId) {
                throw new Error("Service ID is required");
            }
            const serviceExists = yield prisma_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!serviceExists) {
                throw new Error("Service not found");
            }
            const serviceDetails = yield prisma_1.default.serviceDetail.findMany({
                where: {
                    serviceId,
                },
                select: {
                    id: true,
                    photoUrl: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (serviceDetails.length === 0)
                throw new Error("No service details found for this service");
            return serviceDetails.map((detail) => (Object.assign(Object.assign({}, detail), { photoUrl: detail.photoUrl })));
        });
    }
}
exports.GetServiceDetailService = GetServiceDetailService;
