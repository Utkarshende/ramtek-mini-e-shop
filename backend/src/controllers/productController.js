import Product from '../models/Product.js';

// Use 'export' before 'const' so we can pick exactly what we need in the routes
export const createProduct = async (req, res) => {
  try {
    console.log("--- New Request Received ---");
    console.log("Form Data:", req.body);
    console.log("File Data:", req.file); 
    
    const { title, description, price, category, location } = req.body;
    
    // req.file.path is the URL provided by Cloudinary
    const imageUrl = req.file ? req.file.path : ""; 

    const newProduct = new Product({
      title,
      description,
price: Number(price), // Ensure price is a number 
      category,
      location,
      images: [imageUrl], // Store it in our array
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product listed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};