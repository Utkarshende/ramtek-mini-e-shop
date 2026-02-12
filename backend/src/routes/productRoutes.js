import express from 'express';
import upload from '../config/cloudinary.js'; // Import the middleware we just made
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct,
  getMyProducts 
} from '../controllers/productController.js';

const router = express.Router();

// Get all products
router.get('/all', getProducts);

// Get user specific listings (Placed above :id)
router.get('/user/me', getMyProducts);

// Get single product
router.get('/:id', getProductById);

// Create product (Uses the imported upload middleware)
router.post('/create', upload.array('images', 5), createProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;