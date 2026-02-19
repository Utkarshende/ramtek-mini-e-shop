import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ================= SECURITY MIDDLEWARE ================= */

app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "https://ramtek-shop.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/* ================= BODY PARSER ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("🚀 Ramtek Bazar API is running smoothly");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
