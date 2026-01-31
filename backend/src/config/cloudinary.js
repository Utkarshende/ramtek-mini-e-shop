import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// This log will help us see if there are any hidden spaces in the name
console.log(`Configuring Cloudinary for: [${process.env.CLOUDINARY_CLOUD_NAME}]`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(), // .trim() removes accidental spaces
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim()
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ramtek_bazar',
    format: async (req, file) => 'jpg', // force a format to simplify the request
    public_id: (req, file) => file.originalname.split('.')[0] + "_" + Date.now(),
  },
});

export const upload = multer({ storage });