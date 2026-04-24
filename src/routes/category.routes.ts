import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from '../controllers/category/CategoryController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAdminOrSupport } from '../middlewares/isAdminOrSupport';

import uploadConfig from '../config/multer'; 

const categoryRoutes = Router();
const categoryController = new CategoryController();

const upload = multer(uploadConfig.upload());

categoryRoutes.get('/', categoryController.listAll.bind(categoryController));
categoryRoutes.get('/carousel', categoryController.listCarousel.bind(categoryController));
categoryRoutes.get('/:categoryId', categoryController.detail.bind(categoryController));
categoryRoutes.get('/name/:name', categoryController.getByName.bind(categoryController));

categoryRoutes.post('/', isAuthenticated, isAdminOrSupport, upload.single('file'), categoryController.create.bind(categoryController));
categoryRoutes.put('/:categoryId', isAuthenticated, isAdminOrSupport, upload.single('file'), categoryController.update.bind(categoryController));
categoryRoutes.delete('/:categoryId', isAuthenticated, isAdminOrSupport, categoryController.delete.bind(categoryController));

export { categoryRoutes };