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
exports.ListAllSubcategoriesService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListAllSubcategoriesService {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const subcategories = yield prisma_1.default.subcategory.findMany({
                select: {
                    id: true,
                    name: true,
                    categoryId: true,
                    createdAt: true,
                    updatedAt: true,
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
                            serviceDetails: {
                                select: {
                                    id: true,
                                    photoUrl: true,
                                    description: true,
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
                        },
                    },
                },
            });
            const transformedSubcategories = subcategories.map((subcategory) => {
                const processedServices = subcategory.services.map((service) => {
                    const totalRatings = service.ratings.length;
                    const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
                    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
                    return Object.assign(Object.assign({}, service), { serviceDetails: service.serviceDetails.map((detail) => (Object.assign(Object.assign({}, detail), { photoUrl: `/public/images/${detail.photoUrl}` }))), averageRating: parseFloat(averageRating.toFixed(2)) });
                });
                return {
                    id: subcategory.id,
                    name: subcategory.name,
                    categoryId: subcategory.categoryId,
                    createdAt: subcategory.createdAt,
                    updatedAt: subcategory.updatedAt,
                    services: processedServices.sort((a, b) => b.averageRating - a.averageRating),
                };
            });
            return transformedSubcategories;
        });
    }
}
exports.ListAllSubcategoriesService = ListAllSubcategoriesService;
