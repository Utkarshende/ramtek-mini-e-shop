import React, { useState } from 'react'
import API from '../api.js'
import { useNavigate } from 'react-router-dom'

function SellProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    description: '',
    location: 'Ramtek'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/products/add', formData);
      if (res.data.success) {
        alert("Listing posted!");
        navigate('/'); // Redirect to home
      }
    } catch (err) {
      alert("Error posting product.");
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