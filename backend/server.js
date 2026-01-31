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

// --- ROUTES ---
// This tells the app that every route in productRoutes 
// should start with /api/products
app.use('/api/products', productRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ramtek Bazar Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});