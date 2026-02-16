import mongoose from 'mongoose';
console.log("🔥 PRODUCT MODEL UPDATED - NO SELLER FIELD");

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
phoneNumber:
 { type: String,
   required: true },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }

});

// Export the model so we can use it in controllers
export default mongoose.model('Product', productSchema);