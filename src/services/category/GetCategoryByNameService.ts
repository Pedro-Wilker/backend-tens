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
exports.GetCategoryByNameService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetCategoryByNameService {
    execute(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.category.findFirst({
                where: {
                    name: {
                        contains: name.toLowerCase(), // Busca insensível simulada com toLowerCase
                    },
                },
                include: {
                    subcategories: {
                        include: {
                            services: {
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
                                    _count: {
                                        select: { ratings: true },
                                    },
                                    ratings: {
                                        select: {
                                            rating: true,
                                        },
                                    },
                                    serviceDetails: {
                                        select: {
                                            id: true,
                                            photoUrl: true,
                                            description: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!category) {
                throw new Error("Category not found");
            }
            const services = category.subcategories
                .flatMap((sub) => sub.services)
                .map((service) => {
                const totalRatings = service.ratings.length;
                const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
                const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
                return Object.assign(Object.assign({}, service), { serviceDetails: service.serviceDetails.map((detail) => {
                        let cleanPhotoUrl = detail.photoUrl || "";
                        if (!cleanPhotoUrl || cleanPhotoUrl.trim() === "") {
                            cleanPhotoUrl = "placeholder.jpg";
                        }
                        if (cleanPhotoUrl.startsWith("/uploads/")) {
                            cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
                        }
                        return Object.assign(Object.assign({}, detail), { photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/") });
                    }), averageRating: parseFloat(averageRating.toFixed(2)) });
            })
                .sort((a, b) => b.averageRating - a.averageRating);
            return {
                id: category.id,
                name: category.name,
                imageUrl: category.imageUrl ? `/uploads/${category.imageUrl}`.replace("//", "/") : "/uploads/placeholder.jpg",
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                subcategories: category.subcategories.map((sub) => ({
                    id: sub.id,
                    name: sub.name,
                })),
                services,
            };
        });
    }
}
exports.GetCategoryByNameService = GetCategoryByNameService;
