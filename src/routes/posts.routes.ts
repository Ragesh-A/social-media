import { Router } from "express";
import {
  createComment,
  createPost,
  getComments,
  getFilteredPost,
  getMyPosts,
  getPost,
  handleLikePost
} from "../controller/post.controller";
import { addWaterMark, upload } from "../libs/multer";

const router = Router();

router.route('')
  .get(getMyPosts)
  .post(upload.single('image'), addWaterMark, createPost)

router.route('/filter')
  .get(getFilteredPost)

router.route('/:postId')
  .get(getPost)

router.route('/:postId/comments')
  .get(getComments)
  .post(createComment)

router.patch('/:postId/like', handleLikePost)
export default router;