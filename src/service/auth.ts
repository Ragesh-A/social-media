import bcrypt from 'bcrypt'
import User, { IUser } from '../model/user'


async function generateHashPassword(password:string) {
  const hash = await bcrypt.hash(password, 10);
  if (!hash) return false;
  return hash;
}

const loginUser = async (email: string, password: string) => {
  const _user:IUser = await User.findOne({ email }).select('+password');
  if (!_user) throw new Error('No such user');
  if (_user.isBlocked) throw new Error('You are blocked');
  if (!_user.isVerified) throw new Error('waiting for email verification');
  if (!await bcrypt.compare(password, _user.password)) {
    throw new Error('Invalid user credentials');
  }
  const user = filterUserData(_user);
  return user
}

const filterUserData = (user:IUser| any) => {
  const filteredData = { ...user };
  delete filteredData._doc.password;
  return filteredData._doc;
};

const registerUser = async (name: string, email: string, password: string,) => {
  const _existingUser = await User.findOne({ email });
  if (_existingUser) throw new Error('User already exists');
  
  const hashedPassword = await generateHashPassword(password);
  if(!hashedPassword) throw new Error('failed to saved data')
  const _user = new User({ name,email, password: hashedPassword })
  await _user.save()
  return _user
}

const resetPassword = async (email: string, otp:number, newPassword:string) => {
 const hashedPassword = await generateHashPassword(newPassword)
  const user = await User.updateOne(
    { email, otp }, { $set: { password: hashedPassword } }
  )
  return user;
}

export { loginUser, registerUser, resetPassword }