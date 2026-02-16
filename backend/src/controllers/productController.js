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

import Product from "../models/Product.js";

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email"); // 👈 VERY IMPORTANT

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
