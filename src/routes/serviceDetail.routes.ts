import { Router } from 'express';
import multer from 'multer';
import { ServiceDetailController } from '../controllers/serviceDetail/ServiceDetailController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import uploadConfig from '../config/multer';

const serviceDetailRoutes = Router();
const serviceDetailController = new ServiceDetailController();

const upload = multer(uploadConfig.upload());

serviceDetailRoutes.get('/:serviceId', serviceDetailController.list.bind(serviceDetailController));

serviceDetailRoutes.post('/', isAuthenticated, upload.array('file', 10), serviceDetailController.create.bind(serviceDetailController));
serviceDetailRoutes.put('/:serviceId', isAuthenticated, upload.array('file', 10), serviceDetailController.update.bind(serviceDetailController));
serviceDetailRoutes.delete('/:serviceId/:detailId', isAuthenticated, serviceDetailController.delete.bind(serviceDetailController));

export { serviceDetailRoutes };