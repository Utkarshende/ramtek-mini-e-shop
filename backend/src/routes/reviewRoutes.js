import express from 'express';
import Review from '../models/Review.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/reviews
 * @desc    Get all community reviews
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // We populate the 'user' field to get the name of the reviewer
    const reviews = await Review.find()
      .populate('user', 'name') 
      .sort({ createdAt: -1 }); // Newest reviews first
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/reviews
 * @desc    Create a new community review
 * @access  Private (Logged in users only)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const review = new Review({
      user: req.user._id, // Taken from the authMiddleware token
      comment
    });

    await review.save();

    // Populate user name before sending back so the UI updates instantly
    const populatedReview = await review.populate('user', 'name');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private (Owner only)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    review.comment = req.body.comment || review.comment;
    await review.save();

    const updatedReview = await review.populate('user', 'name');
    res.json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Owner only)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;