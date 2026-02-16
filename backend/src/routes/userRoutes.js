import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/* ---------------------------
   RATE SELLER
----------------------------*/
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const totalRatingPoints =
      (seller.rating * seller.numReviews) + rating;

    seller.numReviews += 1;
    seller.rating = totalRatingPoints / seller.numReviews;

    await seller.save();

    res.status(200).json({ message: "Rating updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
