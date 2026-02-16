import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    console.error("Review Fetch Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching reviews from database" 
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { user, comment, rating } = req.body; // Added rating in case you want it later
    
    if (!user || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both a name and a comment" 
      });
    }

    const newReview = new Review({ user, comment, rating });
    await newReview.save();

    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not save your review" 
    });
  }
});

export default router;