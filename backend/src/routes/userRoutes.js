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

export default router;
