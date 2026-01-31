const Product = require('../models/Product');

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