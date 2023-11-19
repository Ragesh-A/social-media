import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { NextFunction, Request, Response } from 'express';



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, 'uploads/')
    } catch (error) {
      console.log(error);

    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


export const addWaterMark = async (req: Request, res: Response, next: NextFunction) => {

  try {
    if (!req.file) throw new Error('no file found');
    const logo = path.resolve('public/white-logo-text.png');
    const logoBuffer = await sharp(logo)
      .toBuffer()

    const watermarkedBuffer = await sharp(req.file.path)
      .composite([{
        input: logoBuffer,
        top: 50,
        left: 50
      }])
      .toFormat('webp', { palette: true })
      .toBuffer()

    await sharp(watermarkedBuffer).toFile(req.file.path);
    next()

  } catch (error: any) {
    console.log('error', error);
    
    res.json({ success: false, message: error.message });
  }
}


export const upload = multer({ storage });
