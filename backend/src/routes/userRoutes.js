import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const seller = await User.findById(req.params.id);
    
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // Calculate new average
    const totalRatingPoints = (seller.rating * seller.numReviews) + rating;
    seller.numReviews += 1;
    seller.rating = totalRatingPoints / seller.numReviews;

    await seller.save();
    res.status(200).json({ message: "Rating updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;