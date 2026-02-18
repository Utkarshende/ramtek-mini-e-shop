import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

/* ================================
   GET SELLER PROFILE
================================ */
router.get('/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');

    if (!seller)
      return res.status(404).json({ message: "Seller not found" });

    const products = await Product.find({ seller: seller._id })
      .sort({ createdAt: -1 });

    res.json({
      seller,
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Seller Profile & their Products
router.get('/seller/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');
    const products = await Product.find({ seller: req.params.id });
    res.json({ success: true, seller, products });
  } catch (error) {
    res.status(500).json({ message: "Seller not found" });
  }
});

export default router;
