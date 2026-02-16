import express from 'express';
import Product from '../models/Product.js';
import upload from '../config/cloudinary.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/* ---------------------------
   GET MY ITEMS (PROTECTED)
----------------------------*/
router.get('/my-items', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error("MY ITEMS ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({ message: error.message });
  }
});


/* ---------------------------
   GET ALL PRODUCTS
----------------------------*/
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ---------------------------
   GET SINGLE PRODUCT
----------------------------*/
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
