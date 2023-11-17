import { Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { LoggedUserRequest } from "../types/request";
import { findUser, userService } from "../service/user.service";
import searchSchema, { ISearchQuery } from "../helper/validator/schema/serach";
import { ValidationError } from "joi";

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
  const updatedUser = await userService.updateUser(userId, name, bio);
  console.log(updatedUser);
  
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