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
exports.CreateServiceService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ providerId, subcategoryId, name, description, price }) {
            if (!providerId || !subcategoryId) {
                throw new Error("Provider ID and Subcategory ID are required");
            }
            if (!name) {
                throw new Error("Service name is required");
            }
            if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
                throw new Error("Price must be a valid non-negative number");
            }
            const providerExists = yield prisma_1.default.user.findUnique({
                where: {
                    id: providerId,
                },
            });
            if (!providerExists) {
                throw new Error("Provider not found");
            }
            const subcategoryExists = yield prisma_1.default.subcategory.findUnique({
                where: {
                    id: subcategoryId,
                },
            });
            if (!subcategoryExists) {
                throw new Error("Subcategory not found");
            }
            const serviceAlreadyExists = yield prisma_1.default.service.findFirst({
                where: {
                    providerId,
                    subcategoryId,
                    name,
                },
            });
            if (serviceAlreadyExists) {
                throw new Error("Service name already exists for this provider and subcategory");
            }
            const service = yield prisma_1.default.service.create({
                data: {
                    providerId,
                    subcategoryId,
                    name,
                    description,
                    price: price !== null && price !== void 0 ? price : undefined,
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
                },
            });
            return service;
        });
    }
}
exports.CreateServiceService = CreateServiceService;
