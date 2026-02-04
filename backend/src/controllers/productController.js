import Product from '../models/Product.js';
import User from '../models/User.js';



// @desc    Get all products (with optional filters)
// @route   GET /api/products/all
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    // .populate('seller') swaps the ID for the actual user name and rating
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

// @desc    Create a new product
// @route   POST /api/products/create
export const createProduct = async (req, res) => {
  try {
    // If you are using Multer for images:
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const productData = {
      ...req.body,
      images: imageUrls,
      seller: req.user._id // Assuming you have an auth middleware
    };

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the owner
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this" });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};