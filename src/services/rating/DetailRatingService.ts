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
exports.DetailRatingService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailRatingService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId }) {
            const serviceRatings = yield prisma_1.default.rating.findMany({
                where: {
                    serviceId: serviceId,
                },
                include: {
                    service: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            });
            if (serviceRatings.length === 0) {
                throw new Error('No ratings found for this service');
            }
            const totalRatings = serviceRatings.length;
            const sumRatings = serviceRatings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
            return {
                serviceRatings,
                serviceAverageRating: parseFloat(averageRating.toFixed(2))
            };
        });
    }
}
exports.DetailRatingService = DetailRatingService;
