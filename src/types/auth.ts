interface IRegister{
  name: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

export { IRegister, ILogin };
