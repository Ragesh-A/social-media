import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helper/catchAsync";
import { verifyToken } from "../libs/jwt";

const requireSignIn = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) throw new Error('Unauthorized');
  const payload: any = await verifyToken(token);
  req.userId = payload.id
  req.role = payload.role;

  next()
})

const adminMiddleWare = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  if (req.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  next()
})

export { requireSignIn, adminMiddleWare }