import { Router } from 'express';
import { SubcategoryController } from '../controllers/subcategoires/SubcategoryController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAdminOrSupport } from '../middlewares/isAdminOrSupport';

const subcategoryRoutes = Router();
const subcategoryController = new SubcategoryController();

subcategoryRoutes.get('/', subcategoryController.listAll.bind(subcategoryController));
subcategoryRoutes.get('/:subcategoryId', subcategoryController.listById.bind(subcategoryController));
subcategoryRoutes.get('/name/:name', subcategoryController.listByName.bind(subcategoryController));
subcategoryRoutes.get('/category/:categoryId', subcategoryController.listByCategory.bind(subcategoryController));
subcategoryRoutes.get('/:subcategoryId/services', subcategoryController.listServices.bind(subcategoryController));

subcategoryRoutes.post('/', isAuthenticated, isAdminOrSupport, subcategoryController.create.bind(subcategoryController));
subcategoryRoutes.put('/:subcategoryId', isAuthenticated, isAdminOrSupport, subcategoryController.update.bind(subcategoryController));
subcategoryRoutes.delete('/:subcategoryId', isAuthenticated, isAdminOrSupport, subcategoryController.delete.bind(subcategoryController));

export { subcategoryRoutes };