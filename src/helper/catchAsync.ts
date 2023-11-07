import { Request, Response, NextFunction } from "express"
import { LoggedUserRequest } from "../types/request"

export const catchAsync = (fn: (req: Request | LoggedUserRequest, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request | LoggedUserRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(error => {
      next(error)
    })
  }
}
