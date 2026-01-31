const mongoose = require('mongoose');

// Define the structure of a Product post
const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Please enter product title"] 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Electronics', 'Books', 'Agri-Tools', 'Furniture'], 
    required: true 
  },
  location: { 
    type: String, 
    default: 'Ramtek, Nagpur' // Defaulting to your area for hyper-local feel
  },
  images: [{ 
    type: String // We will store URLs from Cloudinary here
  }],
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Links the product to a specific User
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model so we can use it in controllers
module.exports = mongoose.model('Product', productSchema);