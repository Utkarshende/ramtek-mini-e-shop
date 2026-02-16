import express from 'express';
import Product from '../models/Product.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

/* ---------------------------
   GET ALL PRODUCTS
----------------------------*/
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

    const products = await Product.find(query)
      .populate('seller', 'name email rating numReviews')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


/* ---------------------------
   CREATE PRODUCT
----------------------------*/
router.post(
  '/create',
  upload.array('images', 5),
  async (req, res) => {
    try {
      const { title, price, category, description, location, phoneNumber } = req.body;

      const imageUrls = req.files?.map(file => file.path) || [];

      const newProduct = new Product({
        title,
        price,
        category,
        description,
        location,
        phoneNumber,
        images: imageUrls,
        seller: req.user.id  // 🔥 seller connected
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


/* ---------------------------
   GET SINGLE PRODUCT
----------------------------*/
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email rating numReviews phone');

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
