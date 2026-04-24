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
exports.UpdateServiceService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateServiceService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId, name, description, price, subcategoryId }) {
            if (!serviceId) {
                throw new Error("Service ID is required");
            }
            if (!name && !description && !price && !subcategoryId) {
                throw new Error("At least one field (name, description, price, or subcategoryId) must be provided to update");
            }
            const service = yield prisma_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                throw new Error("Service not found");
            }
            if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
                throw new Error("Price must be a valid non-negative number");
            }
            if (subcategoryId) {
                const subcategoryExists = yield prisma_1.default.subcategory.findUnique({
                    where: { id: subcategoryId },
                });
                if (!subcategoryExists) {
                    throw new Error("Subcategory not found");
                }
            }
            if (name && name !== service.name) {
                const serviceAlreadyExists = yield prisma_1.default.service.findFirst({
                    where: {
                        providerId: service.providerId,
                        subcategoryId: subcategoryId || service.subcategoryId,
                        name,
                    },
                });
                if (serviceAlreadyExists) {
                    throw new Error("Service name already exists for this provider and subcategory");
                }
            }
            const updateData = {};
            if (name)
                updateData.name = name;
            if (description)
                updateData.description = description;
            if (price != null)
                updateData.price = price;
            if (subcategoryId)
                updateData.subcategoryId = subcategoryId;
            const updatedService = yield prisma_1.default.service.update({
                where: { id: serviceId },
                data: updateData,
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
                },
            });
            const totalRatings = updatedService.ratings.length;
            const sumRatings = updatedService.ratings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
            return Object.assign(Object.assign({}, updatedService), { serviceDetails: updatedService.serviceDetails.map((detail) => (Object.assign(Object.assign({}, detail), { photoUrl: `/public/images/${detail.photoUrl}` }))), serviceAverageRating: parseFloat(averageRating.toFixed(2)) });
        });
    }
}
exports.UpdateServiceService = UpdateServiceService;
