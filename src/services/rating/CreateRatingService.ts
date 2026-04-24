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
exports.CreateRatingService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateRatingService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId, userId, rating }) {
            const service = yield prisma_1.default.service.findUnique({
                where: { id: serviceId }
            });
            if (!service) {
                throw new Error('Service not found');
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const existingRating = yield prisma_1.default.rating.findFirst({
                where: {
                    serviceId: serviceId,
                    userId: userId,
                }
            });
            if (existingRating) {
                throw new Error('You have already rated this service');
            }
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }
            const newRating = yield prisma_1.default.rating.create({
                data: {
                    serviceId,
                    userId,
                    rating,
                },
                select: {
                    id: true,
                    serviceId: true,
                    userId: true,
                    rating: true,
                    createdAt: true,
                },
            });
            return newRating;
        });
    }
}
exports.CreateRatingService = CreateRatingService;
