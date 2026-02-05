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
export const getMyProducts = async (req, res) => {
  try {
    // We filter by the seller ID. 
    // If you don't have auth yet, we'll need to pass the ID differently.
    const products = await Product.find({ seller: req.user._id });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createProduct = async (req, res) => {
  try {
    console.log("Body received:", req.body); // Check if title, price, etc. are here
    console.log("Files received:", req.files); // Check if images are here

    const product = await Product.create({
      ...req.body,
      images: req.files ? req.files.map(f => f.path) : [],
      seller: req.user?._id || req.body.sellerId // Use a fallback if auth isn't set
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Create Error:", error.message); // This will tell us the exact field failing
    res.status(400).json({ success: false, message: error.message });
  }
};