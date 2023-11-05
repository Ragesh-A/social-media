import { Router } from 'express';
import {
  loginController,
  resetPasswordController,
  signupController,
} from '../controller/auth';

const router = Router()

router.post('login', loginController);
router.post('signup', signupController);
router.patch('password', resetPasswordController)

export default router;