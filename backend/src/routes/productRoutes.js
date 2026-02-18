import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js'; // 🔥 YOU FORGOT THIS

const router = express.Router();

/* ---------------------------
   GET MY ITEMS (PROTECTED)
----------------------------*/
router.get('/my-items', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });

  } catch (error) {
    console.error("MY ITEMS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


/* ---------------------------
   CREATE PRODUCT (PROTECTED)
----------------------------*/
router.post(
  '/create',
  authMiddleware,
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
        seller: req.user._id
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        data: newProduct
      });

    } catch (error) {
      console.error("CREATE ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);


/* ---------------------------
   DELETE PRODUCT (PROTECTED)
----------------------------*/
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
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

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update Product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own products" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});s
export default router;
