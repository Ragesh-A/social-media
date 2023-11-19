import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.COLUDNARY_API_SECRET
});
export const uploadToCloud = async (path: string) => {

  const res = await cloudinary.uploader.upload(path);
  return res;

}
