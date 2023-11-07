interface IRegister{
  name: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface IResetPassword {
  email: string;
  password: string;
  otp: number;
}

export {
  IRegister,
  ILogin,
  IResetPassword
};
