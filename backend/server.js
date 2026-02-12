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
  // When you get your Vercel URL, add it to this array
  origin: ["http://localhost:5173", "https://your-ramtek-bazar.vercel.app"], 
  credentials: true
}));
app.use(express.json());

// 2. HEALTH CHECK ROUTE
app.get('/', (req, res) => {
  res.send('🚀 Ramtek Bazar API is running smoothly...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// 3. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});