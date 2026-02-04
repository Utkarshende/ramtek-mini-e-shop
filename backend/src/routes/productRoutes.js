import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// 1. Configure Cloudinary Storage right here
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ramtek_bazar_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// 2. Routes
router.get('/all', getProducts);
router.get('/:id', getProductById);

// 3. Add the upload.array middleware back in
// 'images' must match the name in your React FormData
router.post('/create', upload.array('images', 5), createProduct);

router.delete('/:id', deleteProduct);

export default router;