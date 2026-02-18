import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js'; 

dotenv.config();

const fakeProducts = [
  {
    title: "Royal Enfield Classic 350",
    description: "2021 model, well maintained, 15,000 km driven. Perfect for local travel in Ramtek.",
    price: 165000,
    category: "Vehicles",
    images: ["https://images.unsplash.com/photo-1599819177626-b50f9dd21c9b?q=80&w=1000&auto=format&fit=crop"],
    condition: "Used",
  },
  {
    title: "Gaming Laptop - HP Victus",
    description: "RTX 3050, 16GB RAM, 512GB SSD. Used for 6 months. Bill and box available.",
    price: 52000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop"],
    condition: "Used",
  },
  {
    title: "Wooden Dining Table",
    description: "6-seater solid teak wood dining table. Slightly used but looks brand new.",
    price: 12000,
    category: "Furniture",
    images: ["https://images.unsplash.com/photo-1577145900570-7c059c77c08b?q=80&w=1000&auto=format&fit=crop"],
    condition: "Used",
  },
  {
    title: "2 BHK Flat near Ramtek Temple",
    description: "1200 sq. ft, 2nd floor, balcony with great view. Immediate sale.",
    price: 2500000,
    category: "Real Estate",
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"],
    condition: "New",
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    await Product.deleteMany({});
    console.log("Old data cleared.");

    await Product.insertMany(fakeProducts);
    console.log("Fake data added successfully!");
    
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDB();