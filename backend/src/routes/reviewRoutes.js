import express from "express";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== GET ALL REVIEWS ===================== */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===================== CREATE REVIEW ===================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at least 3 characters long",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      comment: comment.trim(),
    });

    const populatedReview = await review.populate(
      "user",
      "name createdAt"
    );

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===================== UPDATE REVIEW ===================== */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review)
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });

    review.comment = req.body.comment?.trim() || review.comment;
    await review.save();

    const updatedReview = await review.populate(
      "user",
      "name createdAt"
    );

    res.json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===================== DELETE REVIEW ===================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review)
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });

    await review.deleteOne();

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;