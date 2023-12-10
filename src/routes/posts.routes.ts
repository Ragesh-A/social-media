import { Router } from "express";
import {
  createComment,
  createPost,
  getComments,
  getFilteredPost,
  getMyPosts,
  getPost,
  handleLikePost,
  mySavedPosts,
  myLikedPosts,
  addIntoSavedPost,
  deleteFromSavedPost,
} from "../controller/post.controller";
import { addWaterMark, upload } from "../libs/multer";

const router = Router();

router.route('')
  .get(getMyPosts)
  .post(upload.single('image'), addWaterMark, createPost)

router.route('/saved')
  .get(mySavedPosts)

  
router.route('/liked')
  .get(myLikedPosts)

router.route('/filter')
  .get(getFilteredPost)

router.route('/:postId')
  .get(getPost)

router.route('/:postId/comments')
  .get(getComments)
  .post(createComment)

router.patch('/:postId/like', handleLikePost)

router.route('/:postId/saved')
   .post(addIntoSavedPost)
  .delete(deleteFromSavedPost)
   
export default router;