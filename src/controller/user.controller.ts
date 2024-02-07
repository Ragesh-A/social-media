import { NextFunction, Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { LoggedUserRequest } from "../types/request";
import { findUser, userService } from "../service/user.service";
import searchSchema, { ISearchQuery } from "../helper/validator/schema/serach";
import { ValidationError } from "joi";
import { uploadToCloud } from "../libs/cloudnary";
import { unlink } from "fs";

const getProfile = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new Error('failed to fetch user');

  const user = await findUser(userId, '');

  res.status(200).json({
    success: true,
    data: { user }
  })

})

const updateProfile = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.userId || '';
  const { bio, name }: { bio: string, name: string } = req.body;

  const { avatar, background }: any = req.files;

  let avatarRes: any;
  let backgroundRes: any
  if (avatar) {
    avatarRes = await uploadToCloud(avatar[0].path)
    unlink(avatar[0].path, () => { })
  }
  if (background) {
    backgroundRes = await uploadToCloud(background[0].path)
    unlink(background[0].path, () => { })
  }

  const updatedUser = await userService.updateUser(userId, name, bio, avatarRes?.url, backgroundRes?.url);

  res.status(200).json({
    success: true,
    data: { user: updatedUser }
  })
})

const getAllUsers = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const role = req.role
  const userId = req.userId || ''
  const { error, value }
    : {
      error: ValidationError | undefined;
      value: ISearchQuery
    } = searchSchema.validate(req.query);
  if (error) throw new Error(`${error}`);
  const users = await userService.findAllUsers(value, userId, role)
  res.status(200).json({
    success: true,
    data: users
  })
})

const getUser = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.params.userId;
  const reqUser = req.userId || ''
  const user = await findUser(userId, reqUser);

  res.status(200).json({
    success: true,
    data: user
  })
})

const handleBlockUser = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId: string = req.params.userId;
  const action = req.body.action;
  if (!action) throw new Error('Invalid action')
  const user = await userService.blockUser(userId, action)

  res.status(200).json({
    success: true,
    data: user
  })
})

const myFollowers = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId: string = req.userId || '';
  const page = req.query.page
  const followers = await userService.userFollowers(userId, Number(page))

  res.status(200).json({
    success: true,
    data: followers
  })
})

const followUser = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId: string = req.userId || '';
  const follower: string = req.body.user;
  if (!follower) throw new Error('no data')
  const followers = await userService.handleFollow(userId, follower)

  res.status(200).json({
    success: true,
    data: followers
  })
})

const myFollowings = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId: string = req.userId || '';
  const page = req.query.page
  const followings = await userService.userFollowings(userId, Number(page))

  res.status(200).json({
    success: true,
    data: followings
  })
})



export {
  getProfile,
  updateProfile,
  getAllUsers,
  getUser,
  handleBlockUser,
  myFollowers,
  followUser,
  myFollowings
}