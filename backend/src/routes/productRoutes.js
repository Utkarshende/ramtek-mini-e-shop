import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';
import { upload } from '../config/cloudinary.js';
import { getProductById } from '../controllers/productController.js';

const router = express.Router();

// 'images' matches the name we will use in the Frontend form

// Update the POST route to handle Multer errors manually
router.post('/add', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("MULTER/CLOUDINARY ERROR:", err);
      return res.status(500).json({ 
        success: false, 
        message: "File upload failed", 
        error: err.message 
      });
    }
    // If no error, proceed to the controller
    next();
  });
}, createProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);

export default router;