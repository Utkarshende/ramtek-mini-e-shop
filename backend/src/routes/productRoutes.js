import express from 'express';
// We use curly braces { } to "destructure" the specific functions we exported
import { createProduct, getAllProducts } from '../controllers/productController.js';

const router = express.Router();

// Define the endpoints
router.post('/add', createProduct);
router.get('/all', getAllProducts);

export default router;