import React, { useState } from 'react'
import API from '../api.js'
import { useNavigate } from 'react-router-dom'

function SellProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    description: '',
    location: 'Ramtek'
  });
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
    alert("Please select an image first!");
    return;
  }
    
    // We must use FormData for files!
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('image', image);

    try {
     const res = await API.post('/products/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
      if(res.data.success) alert("Listed with Image!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sell an Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-ramtekRed focus:ring-2 focus:ring-red-100 outline-none transition-all"
              placeholder="e.g. Used Engineering Drafter"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-ramtekRed focus:ring-2 focus:ring-red-100 outline-none transition-all"
                placeholder="500"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-ramtekRed outline-none transition-all bg-white"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Agri-Tools">Agri-Tools</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-ramtekRed focus:ring-2 focus:ring-red-100 outline-none transition-all"
              placeholder="Describe condition, age, and why you are selling..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <div className="mb-4">
      <label className="block text-sm font-bold mb-2">Upload Product Image</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-ramtekRed hover:file:bg-red-100"
      />
    </div>

          <button 
            type="submit"
            className="w-full bg-ramtekRed text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 transition-colors active:scale-95"
          >
            List Item Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default SellProduct