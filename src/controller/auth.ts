import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../helper/catchAsync';
import { loginSchema, registrationSchema, resetPasswordSchema } from '../helper/validator/schema/auth';
import { ILogin, IRegister, IResetPassword } from '../types/auth';
import { loginUser, registerUser, resetPassword } from '../service/auth';
import { ValidationError } from 'joi';
import { generateToken } from '../libs/jwt';



const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value }: { error: ValidationError | undefined, value: ILogin } =
    loginSchema.validate(req.body);
  if (error) return next(error);
  const user = await loginUser(value.email, value.password);
  const { _id } = user
  const token = await generateToken({ id: _id, role: user.role })
  res.status(200).json({
    success: true,
    message: 'Login success',
    data: { user: { profile: user }, token }
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
  const { error, value }:
    { error: ValidationError | undefined, value: IResetPassword }
    = resetPasswordSchema.validate(req.body);
  if (error) return next(error)
  await resetPassword(value.email, value.otp, value.password)

  res.status(200).json({
    success: true,
    message: 'Password updated',
    data: null
  })
})


export { loginController, signupController, resetPasswordController }