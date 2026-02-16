import express from 'express';
import User from '../models/User.js';

const router = express.Router();
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


export default router;
