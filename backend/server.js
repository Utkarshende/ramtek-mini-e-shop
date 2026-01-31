import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import our new routes
import productRoutes from './src/routes/productRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/products', productRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ramtek Bazar Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;


app.use((err, req, res, next) => {
  console.error("SERVER ERROR LOG:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message // This will tell us if it's a Cloudinary error
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});