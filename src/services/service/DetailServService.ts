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
exports.DetailServiceService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const isProduction = process.env.NODE_ENV === "production";
class DetailServiceService {
    execute(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!serviceId) {
                throw new Error("Service ID is required");
            }
            const service = yield prisma_1.default.service.findUnique({
                where: { id: serviceId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            number: true,
                            email: true,
                            analfabeto: true,
                        },
                    },
                    subcategory: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    serviceDetails: {
                        select: {
                            id: true,
                            photoUrl: true,
                            description: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    comments: {
                        select: {
                            id: true,
                            text: true,
                            user: {
                                select: { id: true, name: true },
                            },
                            createdAt: true,
                            subcomments: {
                                select: {
                                    id: true,
                                    text: true,
                                    createdAt: true,
                                    user: { select: { id: true, name: true } },
                                },
                                orderBy: { createdAt: "desc" },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    },
                    ratings: {
                        select: {
                            id: true,
                            rating: true,
                            user: {
                                select: { id: true, name: true },
                            },
                            createdAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!service) {
                throw new Error("Service not found");
            }
            const adjustedService = Object.assign(Object.assign({}, service), { serviceDetails: service.serviceDetails.map((detail) => {
                    let cleanPhotoUrl = detail.photoUrl || "";
                    if (cleanPhotoUrl.startsWith("/uploads/")) {
                        cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
                    }
                    return Object.assign(Object.assign({}, detail), { photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/") });
                }), serviceAverageRating: service.ratings.length > 0
                    ? service.ratings.reduce((sum, r) => sum + r.rating, 0) / service.ratings.length
                    : 0 });
            return adjustedService;
        });
    }
}
exports.DetailServiceService = DetailServiceService;
