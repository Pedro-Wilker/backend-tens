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
exports.CreateServiceDetailService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const isProduction = process.env.NODE_ENV === "production";
class CreateServiceDetailService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId, photoDetails }) {
            if (!serviceId) {
                throw new Error("Service ID is required");
            }
            if (!photoDetails || photoDetails.length === 0) {
                throw new Error("At least one photo detail is required");
            }
            const serviceExists = yield prisma_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!serviceExists) {
                throw new Error("Service not found");
            }
            const createdDetails = yield Promise.all(photoDetails.map((photo) => prisma_1.default.serviceDetail.create({
                data: {
                    serviceId,
                    photoUrl: photo.file.filename,
                    description: photo.description,
                },
            })));
            const prefix = isProduction ? "/uploads/" : "/uploads/";
            const adjustedDetails = createdDetails.map((detail) => ({
                id: detail.id,
                photoUrl: `${prefix}${detail.photoUrl}`.replace("//", "/"),
                description: detail.description,
                createdAt: detail.createdAt,
                updatedAt: detail.updatedAt,
            }));
            return adjustedDetails;
        });
    }
}
exports.CreateServiceDetailService = CreateServiceDetailService;
