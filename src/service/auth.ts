import bcrypt from 'bcrypt'
import User from '../model/user'

async function generateHashPassword(password:string) {
  const hash = await bcrypt.hash(password, 10);
  if (!hash) return false;
  return hash;
}

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('No such user');
  if (user.isBlocked) throw new Error('You are blocked');
  if (user.isVerified) throw new Error('waiting for email verification');
  if (!bcrypt.compare(password, user.password)) {
    throw new Error('Invalid user credentials');
  }
  return user;
}

const registerUser = async (name: string, email: string, password: string,) => {
  const _existingUser = await User.findOne({ email });
  if (_existingUser) throw new Error('User already exists');
  
  const hashedPassword = await generateHashPassword(password);
  if(!hashedPassword) throw new Error('failed to saved data')
  const _user = new User({ name,email, password: hashedPassword })
  await _user.save()
  return _user
}

export { loginUser, registerUser }