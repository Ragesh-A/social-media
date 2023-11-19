import { Router } from "express";
import { getProfile, updateProfile } from "../controller/user.controller";
import { upload } from "../libs/multer";

const router = Router()

router.route('')
  .get(getProfile)
  .patch(upload.fields([{name: 'avatar', maxCount: 1}, {name: 'background', maxCount: 1},]) ,updateProfile)

export default router;