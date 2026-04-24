import { Router } from 'express';
import { CommentController } from '../controllers/comment/CommentController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const commentRoutes = Router();
const commentController = new CommentController();

commentRoutes.get('/:serviceId', commentController.list.bind(commentController));

commentRoutes.post('/', isAuthenticated, commentController.create.bind(commentController));
commentRoutes.put('/:commentId', isAuthenticated, commentController.update.bind(commentController));
commentRoutes.delete('/:commentId', isAuthenticated, commentController.delete.bind(commentController));

export { commentRoutes };