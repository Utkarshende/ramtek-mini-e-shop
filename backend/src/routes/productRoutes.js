import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct,
  getMyProducts 
} from '../controllers/productController.js';

const router = express.Router();

// STEP 1: Configure FIRST
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// STEP 2: Verify config (Temporary Debug)
console.log("Cloudinary Configured with Key:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO");

// STEP 3: Create Storage AFTER config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ramtek_bazar_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// ... routes

// 2. Routes
router.get('/all', getProducts);
router.get('/user/me', getMyProducts); // Now this will work!
router.get('/:id', getProductById);

// 3. Add the upload.array middleware back in
// 'images' must match the name in your React FormData
router.post('/create', upload.array('images', 5), createProduct);

router.delete('/:id', deleteProduct);
// Add this route

export default router;