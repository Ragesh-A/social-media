import CommentModel from "../model/comment.model";
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

const getFilteredPost = async (type: string | any, page: number = 1, q: any = '') => {
  let result;
  const search = { $regex: q, $options: 'i' }
  const skip = ((--page > 0 ? --page : 0) * 10);
    
  switch (type) {
    case 'latest':
      result = await PostModel.find().sort({ createdAt: -1 }).skip(skip)
        .limit(10).populate('tags').populate('creator');
      break;
    case 'trending': result = await PostModel.find().sort({ likes: -1}).skip(skip).limit(10).populate('tags').populate('creator');
      break;
    case 'search': result = await PostModel.find({ $or: [{caption: search}, {'tags.name': search}]}).populate('tags').skip(skip).limit(10)
    ; break;
    default: result = await PostModel.find().sort({ createdAt: 1 })
    .skip(skip).limit(10).populate('tags').populate('creator');
      break;
  }
  return result;
}

const getPost = async (postId:string) => {
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

const createNewComment =async (postId: string, userId: string, comment:string) => {
  const newComment = new CommentModel({
    post: postId,
    comments: {
      content: comment,
      user: userId
    }
  })
  return (await newComment.save()).populate('comments.user')
}

const getComments = async (postId: string, page=1) => {
  const skip = ((--page > 0 ? --page : 0) * 10);
  return CommentModel.find({ post:  postId}).sort({ createdAt: -1 }).skip(skip)
    .limit(10).populate('comments.user');
}

export const postService = {
  getUserPosts,
  createPost,
  getFilteredPost,
  likePost,
  getPost,
  createNewComment,
  getComments
};