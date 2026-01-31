const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ['Books', 'Electronics', 'Agri-Tools', 'Household'] },
  location: { type: String, default: 'Ramtek, Nagpur' }, // Hyperlocal marker
  images: [String], // Cloudinary URLs
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);