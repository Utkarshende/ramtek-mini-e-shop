import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
numReviews: { type: Number, default: 0 },
});

export default mongoose.model('User', userSchema);