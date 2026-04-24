import { Router } from 'express';
import { ServiceController } from '../controllers/service/ServiceController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.get('/', serviceController.listAll.bind(serviceController));
serviceRoutes.get('/:serviceId', serviceController.detail.bind(serviceController));
serviceRoutes.get('/category/:categoryId', serviceController.listByCategory.bind(serviceController));

serviceRoutes.post('/', isAuthenticated, serviceController.create.bind(serviceController));
serviceRoutes.put('/:serviceId', isAuthenticated, serviceController.update.bind(serviceController));
serviceRoutes.delete('/:serviceId', isAuthenticated, serviceController.delete.bind(serviceController));

export { serviceRoutes };