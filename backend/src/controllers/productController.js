import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const sellerId = req.user?._id || req.body.seller; 

    if (!sellerId) {
      return res.status(400).json({ success: false, message: "Seller authentication failed" });
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const newProduct = new Product({
      ...req.body,
      images: imageUrls,
      seller: sellerId 
    });

    await newProduct.save();
    const populatedProduct = await newProduct.populate("seller", "name email");

    res.status(201).json({
      success: true,
      data: populatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email"); 
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
