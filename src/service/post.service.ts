import PostModel from "../model/post.model"
import User from "../model/user";

const getUserPosts = async (creator: string, page: number = 1) => {
  return PostModel.find({ creator }).limit(10).skip((--page) * 10).populate('tags').populate('creator');
}

const createPost = async (
  url: string,
  caption: string,
  tags: string[],
  creator: string
) => {

  const newPost = new PostModel({
    isImage: true,
    url,
    caption,
    tags,
    creator,
    views: [creator]
  })
  await User.findByIdAndUpdate({ _id: creator }, { $inc: { postsCount: 1 } }, { upsert: true });


  return (await newPost.save()).populate('tags');
}

const getFilteredPost = async (type: string | any, page: number = 1, q: string = '') => {
  let result;
  switch (type) {
    case 'latest':
      result = await PostModel.find().sort({ createdAt: -1 })
        .limit(10).skip((--page) * 10).populate('tags').populate('creator');
      break;
    case 'trending': result = await PostModel.find().limit(10).skip((--page) * 10).populate('tags').populate('creator');
      break;
    case 'search': result = await PostModel.updateMany({ name: { $regex: q, $option: 'i' }, }); break;
    default: result = await PostModel.find().sort({ createdAt: 1 })
      .limit(10).skip((--page) * 10).populate('tags').populate('creator');
      break;
  }
  return result;
}

const likePost = async (postId: string, userId: string) => {
  let result = await PostModel.findOneAndUpdate(
    { _id: postId, likes: userId },
    { $pull: { likes: userId } },
    { new: true, }
  )
  if (result) {
    User.updateOne({ _id: result?.creator }, { $inc: { likesCount: -1 } }).exec();
  }

  if (!result) {

    result = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } },
      { new: true, }
    )
    User.updateOne({ _id: result?.creator }, { $inc: { likesCount: 1 } }).exec();

  }
  return result

}

const savePost = async () => {


}

export const postService = { getUserPosts, createPost, getFilteredPost, likePost };