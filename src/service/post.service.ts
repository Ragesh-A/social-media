import { SubCategoryModel } from "../model/category.model";
import CommentModel from "../model/comment.model";
import PostModel, { IPost } from "../model/post.model"
import SaveModel from "../model/saves.models";
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

const getFilteredPost = async (type: string | any, page: number = 1, q: any = '') => {
  const limit = 10;
  if (typeof page !== 'number') page = 1
  const search = { $regex: q, $options: 'i' }
  const skip = ((--page > 0 ? page : 0) * limit);
  const commonOptions = {
    skip,
    limit,
    populate: [
      { path: 'tags', select: 'name _id' },
      { path: 'creator', select: ['name', '_id', 'avatar'] }
    ]
  };

  switch (type) {
    case 'latest':
      return await PostModel.find().sort({ createdAt: -1 }).setOptions(commonOptions)
    case 'trending':
      return await PostModel.find().sort({ likes: -1 }).setOptions(commonOptions)
    case 'search':
      return await PostModel.find(
      {
        $or: [
          { caption: search },
          { 'tags': { $in: await SubCategoryModel.find({ name: search, isListed: true }).distinct('_id') } }
        ]
      }).sort({ likes: 1 })
      .setOptions(commonOptions)
    
    default:
      return PostModel.find().sort({ createdAt: 1 }).setOptions(commonOptions)
  }
}

const getPost = async (postId: string) => {
  const post = await PostModel.findOne({ _id: postId }).populate('creator');
  if (!post) throw new Error('No such post');
  return post;
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

const createNewComment = async (postId: string, userId: string, comment: string) => {
  const newComment = new CommentModel({
    post: postId,
    comments: {
      content: comment,
      user: userId
    }
  })
  return (await newComment.save()).populate('comments.user')
}

const getComments = async (postId: string, page = 1) => {
  const skip = ((--page > 0 ? --page : 0) * 10);
  return CommentModel.find({ post: postId }).sort({ createdAt: -1 }).skip(skip)
    .limit(10).populate('comments.user');
}

const userPostsById = async (userId: string): Promise<any> => PostModel.find({ creator: userId })

const likedPosts = async (userId: string, page = 1): Promise<IPost[]> => {
  const skip = ((--page > 0 ? --page : 0) * 10);
  return PostModel.find({ likes: userId })
    .sort({ createdAt: 1 }).skip(skip).limit(10)
}

const savedPosts = async (userId: string, page = 1): Promise<any[]> => {
  const skip = ((--page > 0 ? --page : 0) * 10);
  return PostModel.find({ saved: { $in: userId } })
    .sort({ createdAt: 1 }).skip(skip).limit(10)
}

const saveIntoSavedPost = async (userId: string, postId: string) => {
  const post = await PostModel.findOneAndUpdate({ _id: postId }, {
    $addToSet: { saved: userId }
  }, { new: true }).populate('creator')
  return post;
}

const deleteFromSavedPost = async (userId: string, postId: string) => {
  const post = await PostModel.findOneAndUpdate({ _id: postId }, {
    $pull: { saved: userId }
  }, { new: true }).populate('creator')
  return post;
}


async function updateView(data: Object | Array<Object>, userId: string) {
  const ids: string[] = []
  if (Array.isArray(data)) {
    for (const obj of data) {
      ids.push(obj._id)
    }
    const updated = await PostModel.updateMany({ _id: { $in: ids } }, { $addToSet: { views: userId } })
  } else if (typeof data === 'object') {
    const updated = await PostModel.updateMany({ _id: { $in: ids } })
  }
}

export const postService = {
  getUserPosts,
  createPost,
  getFilteredPost,
  likePost,
  getPost,
  createNewComment,
  getComments,
  userPostsById,
  likedPosts,
  savedPosts,
  saveIntoSavedPost,
  deleteFromSavedPost
};