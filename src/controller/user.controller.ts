import { Response } from "express";
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

  const user = await findUser(userId);

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
  let backgroundRes:any
  if (avatar) {
    avatarRes = await uploadToCloud(avatar[0].path)
    unlink(avatar[0].path, ()=>{})
  }
  if (background) {
    backgroundRes = await uploadToCloud(background[0].path)
    unlink(background[0].path, ()=>{})
  }
  
  const updatedUser = await userService.updateUser(userId, name, bio, avatarRes?.url, backgroundRes?.url);
  
  res.status(200).json({
    success: true,
    data: { user: updatedUser }
  })
})

const getAllUsers = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const { error, value }
    : {
      error: ValidationError | undefined;
      value: ISearchQuery
    } = searchSchema.validate(req.query);
  if (error) throw new Error(`${error}`);
  const users = await userService.findAllUsers(value)
  res.status(200).json({
    success: true,
    data: users
  })
})

const getUser = catchAsync(async (req: LoggedUserRequest, res: Response) => {
  const userId = req.params.userId;
  const user = await findUser(userId);

  res.status(200).json({
    success: true,
    data: user
  })
})



export { getProfile, updateProfile, getAllUsers, getUser }