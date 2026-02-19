import express from 'express';
import Review from '../models/Review.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name') 
      .sort({ createdAt: -1 }); 
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const review = new Review({
      user: req.user._id, 
      comment
    });

    await review.save();

    const populatedReview = await review.populate('user', 'name');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

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


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    
    const reviewOwnerId = review.user.toString();
    const loggedInUserId = req.user._id.toString();

    console.log("Owner:", reviewOwnerId);
    console.log("Logged In:", loggedInUserId);

    if (reviewOwnerId !== loggedInUserId) {
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden: You can only delete your own reviews" 
      });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;