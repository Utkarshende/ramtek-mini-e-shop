import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';
import { upload } from '../config/cloudinary.js';
import { getProductById } from '../controllers/productController.js';
import multer from 'multer';
const upload = multer ({dest:'uploads/'});

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

// Use upload.array('images', 5) to allow up to 5 files
router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    // req.files will now be an array of files
    // You would upload these to Cloudinary here
    const imageUrls = req.files.map(file => file.path); 

    const newProduct = new Product({
      ...req.body,
      images: imageUrls, // Save the array of strings
      seller: req.user._id // From your auth middleware
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;