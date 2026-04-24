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
exports.ListServicesBySubcategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServicesBySubcategoryService {
    execute(subcategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcategoryExists = yield prisma_1.default.subcategory.findUnique({
                where: {
                    id: subcategoryId,
                },
            });
            if (!subcategoryExists) {
                throw new Error("Subcategory not found");
            }
            const services = yield prisma_1.default.service.findMany({
                where: {
                    subcategoryId,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    subcategory: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    serviceDetails: {
                        select: {
                            id: true,
                            photoUrl: true,
                            description: true,
                        },
                    },
                    comments: {
                        select: {
                            id: true,
                            text: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            createdAt: true,
                        },
                    },
                    ratings: {
                        select: {
                            id: true,
                            rating: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            createdAt: true,
                        },
                    },
                    _count: {
                        select: { ratings: true },
                    },
                },
            });
            const sortedServices = services
                .map((service) => {
                const totalRatings = service.ratings.length;
                const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
                const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
                return Object.assign(Object.assign({}, service), { serviceDetails: service.serviceDetails.map((detail) => {
                        let cleanPhotoUrl = detail.photoUrl || "";
                        if (!cleanPhotoUrl || cleanPhotoUrl.trim() === "") {
                            cleanPhotoUrl = "placeholder.jpg";
                        }
                        if (cleanPhotoUrl.startsWith("/public/images/")) {
                            cleanPhotoUrl = cleanPhotoUrl.replace("/public/images/", "");
                        }
                        return Object.assign(Object.assign({}, detail), { photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/") });
                    }), averageRating: parseFloat(averageRating.toFixed(2)) });
            })
                .sort((a, b) => b.averageRating - a.averageRating);
            return sortedServices;
        });
    }
}
exports.ListServicesBySubcategoryService = ListServicesBySubcategoryService;
