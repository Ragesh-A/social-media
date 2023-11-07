import { Router } from 'express';
import authRoute from './auth';
import { getProfile } from '../controller/user.controller';
import { requireSignIn } from '../middleware';

const router = Router();

router.use('/auth', authRoute);
router.use(requireSignIn)
// router.use('/category', )
router.get('/profile', getProfile)

export default router;