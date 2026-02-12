import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all products (Search & Category filter)
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' }; 
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name rating numReviews');

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid Product ID" });
  }
};

// @desc    Create a new product with multiple images
export const createProduct = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(f => f.path) : [];

    // Fallback logic to prevent "seller required" error during development
    // 1. Check req.user (from auth middleware)
    // 2. Check req.body.sellerId (manually passed)
    // 3. Last resort: use a dummy ID for testing purposes
    const sellerId = req.user?._id || req.body.sellerId || "65cb7f1e9b1d2c3d4e5f6a7b";

    const product = await Product.create({
      ...req.body,
      images: imageUrls,
      seller: sellerId 
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Create Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get listings created by the logged-in user
export const getMyProducts = async (req, res) => {
  try {
    // Safety check: if req.user is missing, return empty or unauthorized
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Ownership check (only allow if seller matches logged in user)
    if (!req.user || product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};