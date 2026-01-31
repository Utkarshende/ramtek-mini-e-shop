import express from 'express';
const router = express.Router();

// Import the logic we wrote in the controller
const { createProduct } = require('../controllers/productController');

// Define the path for adding a product
// This will be accessible at http://localhost:5000/api/products/add
router.post('/add', createProduct);


// We export this so the main server.js can use it
module.exports = router;