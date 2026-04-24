import { Router } from 'express';
import { UserController } from '../controllers/user/UserController';


const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', userController.create.bind(userController));
userRoutes.post('/session', userController.auth.bind(userController));


userRoutes.get('/me', userController.detail.bind(userController));
userRoutes.get('/profile', userController.getDetailedProfile.bind(userController));
userRoutes.put('/:userId', userController.update.bind(userController));
userRoutes.delete('/:userId', userController.delete.bind(userController));

userRoutes.get('/role/:role', userController.getByRole.bind(userController));
userRoutes.get('/provider-await', userController.listProviderAwait.bind(userController));
userRoutes.post('/request-provider', userController.requestProviderRole.bind(userController));
userRoutes.put('/:userId/approve-provider', userController.approveProvider.bind(userController));

export { userRoutes };