import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// 'images' matches the name we will use in the Frontend form
router.post('/add', upload.single('image'), createProduct);
router.get('/all', getAllProducts);

export default router;