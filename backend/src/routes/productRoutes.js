import express from 'express';
import Product from '../models/Product.js'; // Ensure path to your model is correct

const router = express.Router();

// @desc    Get all products with filtering and search
// @route   GET /api/products/all
router.get('/all', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // 1. Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Search by Title (Case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch products"
    });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid Product ID" });
  }
});

export default router;