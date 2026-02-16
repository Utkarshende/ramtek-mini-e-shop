import express from 'express';
import Product from '../models/Product.js';
import upload from '../middleware/multer.js'; // You need to create this middleware
import cloudinary from '../config/cloudinary.js'; // You need to create this config

const router = express.Router();

// @desc    Create a new product with images
// @route   POST /api/products/create
router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    const { title, price, category, description, location, phoneNumber } = req.body;

    // 1. Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // This converts the buffer to a base64 string for Cloudinary
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "ramtek_bazar",
        });
        imageUrls.push(result.secure_url);
      }
    }

    // 2. Save to MongoDB
    const newProduct = new Product({
      title,
      price,
      category,
      description,
      location,
      phoneNumber,
      images: imageUrls,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
});

// @desc    Get all products with filtering and search
// @route   GET /api/products/all
router.get('/all', async (req, res) => {
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

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
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