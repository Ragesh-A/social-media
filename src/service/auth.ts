import bcrypt from 'bcrypt'
import User, { IUser } from '../model/user'


async function generateHashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  if (!hash) return false;
  return hash;
}

const loginUser = async (email: string, password: string) => {
  const _user: IUser = await User.findOne({ email }).select('+password +isVerified +isBlocked +role');
  if (!_user) throw { message: 'No such user', status: 400 };
  console.log(_user);

  if (_user.isBlocked) throw { message: 'You are blocked', status: 403 };
  if (!_user.isVerified) throw { message: 'waiting for email verification', status: 200 };
  if (!await bcrypt.compare(password, _user.password)) {
    throw { message: 'Invalid user credentials', status: 403 };
  }
  const user = filterUserData(_user);
  return user
}

const filterUserData = (user: IUser | any) => {
  const filteredData = { ...user };
  delete filteredData._doc.password;
  return filteredData._doc;
};

const registerUser = async (name: string, email: string, password: string,) => {
  const _existingUser = await User.findOne({ email });
  if (_existingUser) throw { message:'User already exists', status: 400 };

  const hashedPassword = await generateHashPassword(password);
  if (!hashedPassword) throw { message: 'failed to saved data', status: 400 }
  const _user = new User({ name, email, password: hashedPassword })
  await _user.save()
  return _user
}

const resetPassword = async (email: string, otp: number, newPassword: string) => {
  const hashedPassword = await generateHashPassword(newPassword)
  const user = await User.updateOne(
    { email, otp }, { $set: { password: hashedPassword } }
  )
  return user;
}

export { loginUser, registerUser, resetPassword }