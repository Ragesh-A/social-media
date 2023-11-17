import { Router } from "express";
import { getProfile, updateProfile } from "../controller/user.controller";

const router = Router()

router.route('')
  .get(getProfile)
  .patch(updateProfile)

export default router;