import { Router } from "express";
import { createPost, getFilteredPost, getMyPosts, handleLikePost } from "../controller/post.controller";
const router = Router();

router.route('')
  .get(getMyPosts)
  .post(createPost)

  
  router.route('/filter')
  .get(getFilteredPost)
  
router.patch('/:postId/like', handleLikePost)
export default router;