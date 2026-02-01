router.post('/:id/rate', async (req, res) => {
  const { rating } = req.body; // 1 to 5
  try {
    const seller = await User.findById(req.params.id);
    // Logic to calculate new average rating
    seller.rating = (seller.rating * seller.numReviews + rating) / (seller.numReviews + 1);
    seller.numReviews += 1;
    await seller.save();
    res.status(200).json({ message: "Rating submitted" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating" });
  }
});