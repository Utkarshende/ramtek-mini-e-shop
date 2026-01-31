import express from 'express';
const router = express.Router();

import { createProduct, getAllProducts } from '../controllers/productController.js';


// Define the path for adding a product
// This will be accessible at http://localhost:5000/api/products/add
router.post('/add', createProduct);

router.get('/all', getAllProducts);





// We export this so the main server.js can use it
module.exports = router;