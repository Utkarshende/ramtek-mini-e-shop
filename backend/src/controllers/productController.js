import Product from '../models/Product.js';

// Use 'export' before 'const' so we can pick exactly what we need in the routes
export const createProduct = async (req, res) => {
  try {
    // 1. Check if Multer failed
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File upload failed at Multer level" });
    }
    const { title, description, price, category, location } = req.body;

const product = await Product.findById(req.params.id).populate('seller','name rating numReviews');

if (!product) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-blue-500 animate-pulse font-bold tracking-widest">
        LOADING DETAILS...
      </div>
    </div>
  );
}
    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      category,
      location,
      images: [req.file.path], 
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Success!" });

  } catch (dbError) {
    // 2. This sends the SPECIFIC error (like "Title is required") back to React
    res.status(500).json({ success: false, message: dbError.message });
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
    const product = await Product.findById(req.params.id)
    .populate('seller', 'name rating numReviews');
    
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

