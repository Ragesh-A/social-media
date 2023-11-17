import { Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { LoggedUserRequest } from "../types/request";
import { postService } from "../service/post.service";
import { postSchema } from "../helper/validator/schema";
import { ValidationError } from "joi";
import { IPost } from "../model/post.model";

const getMyPosts = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.userId || '';
  const posts = await postService.getUserPosts(userId)

  res.status(200).json({
    success: true,
    data: posts
  })
})

const createPost = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const { value, error }
    : { error: ValidationError | undefined, value: IPost | any } = postSchema.validate(req.body);
  if (error) throw new Error(`${error}`)

  if (error) throw new Error(JSON.stringify(error));
  const post = await postService.createPost(value.image, value.caption, value.tags, req.userId || '');

  res.status(200).json({
    success: true,
    data: post
  })
})

const getFilteredPost = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  let q = req.query.q || ''
  if (Array.isArray(q)) {
    q = q[0] || '';
  }
  const result = await postService.getFilteredPost(q);

  res.status(200).json({
    success: true,
    data: result
  })
})

const handleLikePost = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const postId: string = req.params.postId;
  const userId = req.userId || '';
  const post = await postService.likePost(postId, userId)
  res.status(200).json({
    success: true,
    data: {post}
  })
})

export { getMyPosts, createPost, getFilteredPost, handleLikePost }