import express from 'express';
import Review from '../models/Review.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================================
   CREATE REVIEW (Fixed URL structure)
================================ */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;
    const review = new Review({
      user: req.user._id,
      comment
    });
    await review.save();
    const populatedReview = await review.populate('user', 'name');
    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








/* ================================
   CREATE REVIEW
================================ */
router.post('/:productId', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = new Review({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();

    const populatedReview = await review.populate('user', 'name');

    res.status(201).json({ success: true, data: populatedReview });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================================
   UPDATE REVIEW
================================ */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    res.json({ success: true, data: review });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================================
   DELETE REVIEW
================================ */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
