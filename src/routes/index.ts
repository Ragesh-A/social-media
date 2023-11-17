import { Router } from 'express';
import authRoute from './auth';
import categoryRoute from './category.routes'
import usersRoute from './user.routes'
import postRoute from './posts.routes'
import profileRoute from './profile.routes';
import { requireSignIn } from '../middleware';
import { getFilteredPost } from '../controller/post.controller';

const router = Router();

router.use('/auth', authRoute);
router.get('/search', getFilteredPost);
router.use(requireSignIn)
router.use('/category', categoryRoute)
router.use('/posts', postRoute)
router.use('/profile', profileRoute)
router.use('/users', usersRoute)

export default router;