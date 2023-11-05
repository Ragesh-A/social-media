import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../helper/catchAsync';
import { loginSchema, registrationSchema } from '../helper/validator/schema/auth';
import { ILogin, IRegister } from '../types/auth';
import { loginUser, registerUser } from '../service/auth';
import { ValidationError } from 'joi';



const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value }: { error: ValidationError| undefined, value: ILogin } =
    loginSchema.validate(req.body);
  if (error) return next(error);
  const user = await loginUser(value.email, value.password);

  res.status(200).json({
    success: true,
    message: 'Login success',
    data: user
  })
})



const signupController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value }: {
    error: ValidationError | undefined, value: IRegister
  } = registrationSchema.validate(req.body);
  if (error) return next(error)
  const user = await registerUser(value.name, value.email, value.password)
  if (!user) throw new Error('No such user');

  res.status(201).json({
    success: true,
    message: 'Verification mail sended',
    data: null
  })
})

const resetPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


export { loginController, signupController, resetPasswordController }