
import productRoutes from './src/routes/productRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import authRoutes from './src/routes/authRoutes.js';
import dotenv from 'dotenv';
import reviewRoutes from './src/routes/reviewRoutes.js';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// DEBUG LOG: If this prints 'undefined' in your terminal, the .env isn't loading!
console.log("Checking Secret:", process.env.CLOUDINARY_API_SECRET ? "SECRET FOUND" : "SECRET IS MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Ensure this name matches the .env exactly
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ramtek_bazar',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export const upload = multer({ storage });

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/reviews', reviewRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ramtek Bazar Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;


app.use((err, req, res, next) => {
  // If err is null/undefined, we log the whole object to see what's happening
  console.error("FULL ERROR OBJECT:", err); 
  
  res.status(500).json({
    success: false,
    message: err?.message || "Unknown Server Error",
    stack: process.env.NODE_ENV === 'development' ? err?.stack : {}
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});