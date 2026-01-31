import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
    const { user, comment } = req.body;
    if (!user || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newReview = new Review({ user, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Error saving review" });
  }
});

export default router;