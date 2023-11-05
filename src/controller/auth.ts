import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../helper/catchAsync';

const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  console.log(data);

})

const signupController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const resetPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


export { loginController, signupController, resetPasswordController }