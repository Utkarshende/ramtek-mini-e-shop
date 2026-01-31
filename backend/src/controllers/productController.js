import Product from '../models/Product.js';

// Use 'export' before 'const' so we can pick exactly what we need in the routes
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, location, images, sellerId } = req.body;

    // Create a new instance of the Product model
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      location,
      images,
      seller: sellerId
    });

    // Await the database save operation
    const savedProduct = await newProduct.save();

    // 201 means "Created" - very important for interviewers!
    res.status(201).json({
      success: true,
      message: "Product listed successfully in Ramtek Bazar!",
      data: savedProduct
    });

  } catch (error) {
    // 500 means "Server Error"
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // .find() fetches all. .sort({createdAt: -1}) shows newest items first
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch products from Ramtek database"
    });
  }
};