import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
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
    default: 'Ramtek, Nagpur'
  },

  images: [{ 
    type: String 
  }],

  phoneNumber: { 
    type: String,
    required: true 
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }

});

export default mongoose.model('Product', productSchema);
