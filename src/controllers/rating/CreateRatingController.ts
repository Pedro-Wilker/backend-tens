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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRatingController = void 0;
const CreateRatingService_1 = require("../../services/rating/CreateRatingService");
class CreateRatingController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, rating } = req.body;
            const userId = Number(req.user_id);
            const createRatingService = new CreateRatingService_1.CreateRatingService();
            try {
                const newRating = yield createRatingService.execute({ serviceId: Number(serviceId), userId, rating });
                return res.status(201).json(newRating);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CreateRatingController = CreateRatingController;
