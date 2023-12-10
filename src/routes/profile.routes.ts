import { Router } from "express";
import { followUser, getProfile, myFollowers, myFollowings, updateProfile } from "../controller/user.controller";
import { upload } from "../libs/multer";

const router = Router()

router.route('')
  .get(getProfile)
  .patch(upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 },]), updateProfile)

router.route('/followers')
  .get(myFollowers)
  .post(followUser)

router.route('/followings')
  .get(myFollowings)

export default router;