import Product from '../models/Product.js';

// Function to create a new product listing
exports.createProduct = async (req, res) => {
  try {
    // We take data from the request body (sent by React frontend)
    const { title, description, price, category, location, images, sellerId } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      location,
      images,
      seller: sellerId
    });

    // Save to MongoDB
    const savedProduct = await newProduct.save();

    // Send success response back to frontend
    res.status(201).json({
      success: true,
      message: "Product listed successfully in Ramtek Bazar!",
      data: savedProduct
    });
  } catch (error) {
    // If something goes wrong, send the error message
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function to get all products from the database
exports.getAllProducts = async (req, res) => {
  try {
    // Find() with no arguments gets EVERYTHING in that collection
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch products"
    });
  }
};