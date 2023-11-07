import { Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { LoggedUserRequest } from "../types/request";
import { findUser } from "../service/user.service";

const getProfile = catchAsync(async (req: LoggedUserRequest, res:Response) => {
  const userId = req.userId;
  if (!userId) throw new Error('failed to fetch user');
  
  const user = await findUser(userId);

  res.status(200).json({
    success: true,
    data: {user}
  })
  
})

export {getProfile}