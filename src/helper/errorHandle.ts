import { NextFunction, Request, Response } from "express";

export const globalErrorHandle = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  res.status(err?.status || 200).json({
    status: err?.status || 500,
    success: false,
    message: err?.message || 'Internal server Error',
  })
}