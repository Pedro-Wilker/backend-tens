import { Router } from 'express';
import { SubcommentController } from '../controllers/subcomment/SubcommentController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const subcommentRoutes = Router();
const subcommentController = new SubcommentController();

subcommentRoutes.get('/:commentId', subcommentController.list.bind(subcommentController));

subcommentRoutes.post('/:commentId', isAuthenticated, subcommentController.create.bind(subcommentController));
subcommentRoutes.put('/:subcommentId', isAuthenticated, subcommentController.update.bind(subcommentController));
subcommentRoutes.delete('/:subcommentId', isAuthenticated, subcommentController.delete.bind(subcommentController));

export { subcommentRoutes };