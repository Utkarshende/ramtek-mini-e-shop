import React, { useState } from 'react';
import axios from 'axios';

const SellProduct = () => {
  // 1. STATE: We create an object to hold all the form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    location: 'Ramtek, Nagpur'
  });

  // 2. HANDLER: This function updates the state as the user types
  const handleChange = (e) => {
    // [e.target.name] matches the 'name' attribute of the input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SUBMIT: This function sends the data to your Node.js backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from refreshing the page
    
    try {
      const response = await axios.post('http://localhost:5000/api/products/add', formData);
      
      if (response.data.success) {
        alert("Success! Your item is listed in Ramtek Bazar.");
        // Reset form after success
        setFormData({ title: '', description: '', price: '', category: 'Electronics', location: 'Ramtek, Nagpur' });
      }
    } catch (error) {
      console.error("Error posting product:", error);
      alert("Failed to post item. Check if Backend is running!");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Sell Something in Ramtek</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>Product Title</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="e.g. KITS Second year Books" 
          style={inputStyle}
          required 
        />

        <label>Price (₹)</label>
        <input 
          name="price" 
          type="number" 
          value={formData.price} 
          onChange={handleChange} 
          placeholder="Enter amount" 
          style={inputStyle}
          required 
        />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Agri-Tools">Agri-Tools</option>
          <option value="Furniture">Furniture</option>
        </select>

        <label>Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Tell buyers about your item..." 
          style={{ ...inputStyle, height: '100px' }}
          required 
        />

        <button type="submit" style={buttonStyle}>Post My Ad</button>
      </form>
    </div>
  );
};

// --- Clean UI Styles ---
const containerStyle = { padding: '40px 10%', maxWidth: '600px', margin: 'auto' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  backgroundColor: '#FF4D4D',
  color: 'white',
  padding: '15px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1.1rem'
};

export default SellProduct;