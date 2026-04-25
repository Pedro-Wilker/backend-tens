import { Router } from 'express';
import { UserController } from '../controllers/user/UserController'; 
import { isAuthenticated } from '../middlewares/isAuthenticated'; 

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', userController.create.bind(userController));
userRoutes.post('/session', userController.auth.bind(userController));

userRoutes.get('/me', isAuthenticated, userController.detail.bind(userController));
userRoutes.get('/profile', isAuthenticated, userController.getDetailedProfile.bind(userController));
userRoutes.put('/:userId', isAuthenticated, userController.update.bind(userController));
userRoutes.delete('/:userId', isAuthenticated, userController.delete.bind(userController));

userRoutes.get('/role/:role', isAuthenticated, userController.getByRole.bind(userController));
userRoutes.get('/provider-await', isAuthenticated, userController.listProviderAwait.bind(userController));
userRoutes.post('/request-provider', isAuthenticated, userController.requestProviderRole.bind(userController));
userRoutes.put('/:userId/approve-provider', isAuthenticated, userController.approveProvider.bind(userController));

export { userRoutes };