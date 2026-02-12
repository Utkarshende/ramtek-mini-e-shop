import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

// Configuration
dotenv.config();
connectDB();

const app = express();

// 1. IMPROVED MIDDLEWARE
app.use(cors({
  // Add your Vercel URL here once you deploy the frontend
  origin: [
    "http://localhost:5173", 
    "https://ramtek-shop.netlify.app/", // Replace with your actual Vercel URL
    "https://ramtek-bazar-backend.onrender.com"
  ], 
  credentials: true
}));
app.use(express.json());

// 2. HEALTH CHECK ROUTE
app.get('/', (req, res) => {
  res.send('🚀 Ramtek Bazar API is running smoothly at https://ramtek-bazar-backend.onrender.com');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// 3. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack); 
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Live URL: https://ramtek-bazar-backend.onrender.com`);
});