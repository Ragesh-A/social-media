import User from "../model/user"

const findUser = async (_id: string) => User.findOne({ _id })

const updateUser = async (_id:string, name: string, bio:string) => {
  return User.findOneAndUpdate({ _id }, { name, bio }, { upsert: true, new: true });
} 

const findAllUsers = async ({ q, orderBy, page, role }: {
  q: any,
  orderBy: 'asc' | 'desc',
  page: string | number,
  role: string
}
) => {

  let skip = Number(page) || 1
  const search = { $regex: q, $options: 'i' }
  const sort = orderBy === 'asc' ? 1 : -1;

  const users = await User.find({
    role,
    $or: [{ name: search }, { email: search }]
  })
    .sort({ createdAt: sort})
    .limit(20)
    .skip(--skip * 20)
  
  return users
}

export const userService = { findAllUsers, updateUser }

export { findUser }