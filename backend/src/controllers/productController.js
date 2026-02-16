import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      location,
      phoneNumber,
      seller
    } = req.body;

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const newProduct = new Product({
      title,
      price,
      category,
      description,
      location,
      phoneNumber,
      images: imageUrls,
      seller
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
s