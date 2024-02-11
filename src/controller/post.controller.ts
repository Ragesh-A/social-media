import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { LoggedUserRequest } from "../types/request";
import { postService } from "../service/post.service";
import { postSchema } from "../helper/validator/schema";
import { ValidationError } from "joi";
import { IPost } from "../model/post.model";
import { uploadToCloud } from "../libs/cloudnary";
import { unlink, unlinkSync } from "fs";

const getMyPosts = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.userId || "";
  const posts = await postService.getUserPosts(userId);

  res.status(200).json({
    success: true,
    data: posts,
  });
});

const createPost = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const { value, error }
    : { error: ValidationError | undefined; value: IPost | any } = postSchema.validate(req.body);
  if (error) throw { message: error, status: 400 };
  if (error) throw { message: error, status: 400 };
  if (!req.file) throw { message: "no file is uploaded", status: 400 };

  const cloudinaryRes: { url: string } = await uploadToCloud(req.file.path);

  unlink(req.file.path, () => {});
  console.log(value.tags);

  const post = await postService.createPost(
    cloudinaryRes.url,
    value.caption,
    value.tags,
    req.userId || ''
  );

  res.status(200).json({
    success: true,
    data: post
  })
})

const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const post = await postService.getPost(postId);
    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

const getFilteredPost = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    let q = req.query.q || ''
    const page = req.query.page || 1;
    let type = req.query.type || '';

    if (Array.isArray(q)) {
      q = q[0] || '';
    }
    if (Array.isArray(type)) {
      type = type[0] || '';
    }
    const result = await postService.getFilteredPost(type, Number(page), q);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

const handleLikePost = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const postId: string = req.params.postId;
    const userId = req.userId || '';
    const post = await postService.likePost(postId, userId);
    res.status(200).json({
      success: true,
      data: { post },
    });
  }
);

const createComment = catchAsync(
  async (req: LoggedUserRequest, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const userId = req.userId || '';
    const { comment }: { comment: string } = req.body;
    const newComment = await postService.createNewComment(
      postId,
      userId,
      comment
    );
    res.status(200).json({
      success: true,
      data: newComment,
    });
  }
);

const getComments = catchAsync(
  async (req: LoggedUserRequest, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const page = req.query.page;
    const newComment = await postService.getComments(postId, Number(page));
    res.status(200).json({
      success: true,
      data: newComment,
    });
  }
);

const getUserPostsById = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const userId: string = req.params.userId;
    const posts = await postService.userPostsById(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  }
);

const mySavedPosts = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const userId: string = req.userId || '';
    const page = req.query.page || 1;
    if (!userId) throw { message: "Failed to identify user", status: 403 };
    const posts = await postService.savedPosts(userId, Number(page));

    res.status(200).json({
      success: true,
      data: posts,
    });
  }
);

const addIntoSavedPost = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw { message: "Failed to identify user", status: 403 };
    const postId = req.params.postId;
    if (!postId) throw { message: "No post id found", status: 400 };

    const savedPost = await postService.saveIntoSavedPost(userId, postId);

    res.status(200).json({
      success: true,
      data: savedPost,
    });
  }
);
const deleteFromSavedPost = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw { message: "Failed to identify user", status: 403 };
    const postId = req.params.postId;
    if (!postId) throw { message: "No post id found", status: 400 };

    const savedPost = await postService.deleteFromSavedPost(userId, postId);

    res.status(200).json({
      success: true,
      data: savedPost,
    });
  }
);

const myLikedPosts = catchAsync(
  async (req: LoggedUserRequest, res: Response) => {
    const userId: string = req.userId || "";
    if (!userId) throw { message: "Failed to identify user", status: 403 };
    const posts = await postService.likedPosts(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  }
);

export {
  getMyPosts,
  createPost,
  getFilteredPost,
  handleLikePost,
  getPost,
  createComment,
  getComments,
  getUserPostsById,
  mySavedPosts,
  myLikedPosts,
  addIntoSavedPost,
  deleteFromSavedPost,
};
