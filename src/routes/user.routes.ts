import { Router } from "express";
import { adminMiddleWare } from "../middleware";
import { getAllUsers, getUser, handleBlockUser } from "../controller/user.controller";
import { getUserPostsById } from "../controller/post.controller";

const router = Router()


router.get('', getAllUsers)
router.route('/:userId')
  .get(getUser)
  .patch(adminMiddleWare, handleBlockUser)
router.get('/:userId/posts', getUserPostsById)

export default router;