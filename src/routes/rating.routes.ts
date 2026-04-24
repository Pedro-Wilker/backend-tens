import { Router } from 'express';
import { RatingController } from '../controllers/rating/RatingController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const ratingRoutes = Router();
const ratingController = new RatingController();

ratingRoutes.get('/:serviceId', ratingController.detail.bind(ratingController));

ratingRoutes.post('/', isAuthenticated, ratingController.create.bind(ratingController));

export { ratingRoutes };