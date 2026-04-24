import { Router } from 'express';

import { userRoutes } from './user.routes';
import { categoryRoutes } from './category.routes';
import { subcategoryRoutes } from './subcategory.routes';
import { serviceRoutes } from './service.routes';
import { serviceDetailRoutes } from './serviceDetail.routes';
import { ratingRoutes } from './rating.routes';
import { commentRoutes } from './comment.routes';
import { subcommentRoutes } from './subcomment.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/services', serviceRoutes);
router.use('/service-details', serviceDetailRoutes);
router.use('/ratings', ratingRoutes);
router.use('/comments', commentRoutes);
router.use('/subcomments', subcommentRoutes);

export { router };