import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
// express.json() allows the server to understand JSON data sent from the frontend
app.use(express.json()); 
// cors() prevents "Blocked by CORS" errors during development
app.use(cors()); 

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ramtek Bazar Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// A simple test route to check if server is working
app.get('/', (req, res) => {
  res.send("Ramtek Bazar API is running...");
});

// Set the Port (Use 5000 or the one provided by hosting service)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});