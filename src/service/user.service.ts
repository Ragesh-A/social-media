import User from "../model/user"

const findUser = async (_id: string) => User.findOne({ _id })


export {findUser}