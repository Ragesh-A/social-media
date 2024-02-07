import User, { followers } from "../model/user"

const findUser = async (_id: string, userId: string) => {
  const user = await User.findOne({ _id })
    .select('+isBlocked +isVerified +role')
  if (!user) throw new Error('no user found')
  console.log(_id);

  let isFollowing = userId ? await followers.findOne({ user: _id, follower: userId }) : false
  const followersCountPromise = followers.find({ follower: _id }).countDocuments()
  const followingCountPromise = followers.find({ user: _id }).countDocuments()

  const [followersCount, followingCount] =
    await Promise.all([followersCountPromise, followingCountPromise]);

  return {
    profile: user,
    isFollowing,
    followersCount,
    followingCount
  }
}

const updateUser = async (_id: string, name: string, bio: string, avatar: string, backgroundImg: string) => {
  return User.findOneAndUpdate({ _id }, { name, bio, avatar, backgroundImg }, { upsert: true, new: true });
}

const findAllUsers = async ({ orderBy, page, role = 'user', q = '' }: {
  q: any,
  orderBy: 'asc' | 'desc',
  page: string | number,
  role: string,
},
  userId: string,
  userRole = 'user'
) => {

  let skip = Number(page) || 1
  const search = { $regex: q, $options: 'i' }
  const sort = orderBy === 'asc' ? 1 : -1;

  const users = await User.find({
    role,
    $and: [
      { $or: [{ name: search }, { email: search }] },
      { _id: { $ne: userId } }
    ]
  })
    .sort({ createdAt: sort })
    .limit(20)
    .skip(--skip * 20).select(`+isBlocked ${userRole === 'admin' ? '+email' : ''}`)

  return users
}

const blockUser = async (userId: string, type: string) => {
  let value = true;
  if (type === 'BLOCK') {
    value = true
  }
  else if (type === 'UN_BLOCK') {
    value = false
  }
  else throw new Error("Invalid action")

  const _user = await User.findOneAndUpdate({ _id: userId }, { $set: { isBlocked: value } }, { new: true });
  if (!_user) throw new Error('No such user exists');
  return _user;

}

const userFollowers = async (userId: string, page = 1) => {
  const skip = ((--page > 0 ? page : 0) * 10);
  return await followers.find({ follower: userId })
    .sort({ 'follower.name': 1 })
    .skip(skip).limit(10).populate('user')
}

const handleFollow = async (user: string, follower: string) => {
  const isCreated = await followers.findOne({ user, follower })
  if (isCreated) {
    const d = await followers.deleteOne({ user, follower })
    return d
  } else {
    return new followers({ user, follower }).save()
  }
}

const userFollowings = async (userId: string, page = 1) => {
  const skip = ((--page > 0 ? page : 0) * 10);
  return await followers.find({ user: userId })
    .sort({ 'user.name': 1 })
    .skip(skip).limit(20).populate('follower')
}

export const userService = {
  findAllUsers,
  updateUser,
  blockUser,
  userFollowers,
  userFollowings,
  handleFollow
}

export { findUser }