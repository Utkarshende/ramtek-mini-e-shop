import React, { useState } from 'react';
import API from '../api.js';

function SellProduct() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', price: '', category: 'Electronics', description: '', location: '', phoneNumber: ''
  });

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 5) {
      return alert("You can only upload up to 5 images.");
    }

    setFiles([...files, ...selectedFiles]);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    files.forEach(file => data.append('images', file));

    try {
      await API.post('/products/create', data);
      alert("Product listed successfully!");
      // window.location.href = '/'; 
    } catch (err) {
      alert("Error uploading. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center text-white">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold">List an <span className="text-blue-500">Item</span></h2>

        {/* Image Upload Area */}
        <div className="flex flex-wrap gap-4 p-4 border-2 border-dashed border-slate-800 rounded-2xl">
          <label className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-all">
            <span className="text-2xl text-slate-400">+</span>
            <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
          </label>

          {previews.map((url, i) => (
            <div key={i} className="relative w-20 h-20 group">
              <img src={url} className="w-full h-full object-cover rounded-xl border border-slate-700" alt="" />
              <button 
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Form Inputs (Title, Price, etc.) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Item Name" className="bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <input type="number" placeholder="Price (₹)" className="bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        </div>
        
        <textarea placeholder="Description..." className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-blue-500 h-32" onChange={(e) => setFormData({...formData, description: e.target.value})} required />

        <button 
          disabled={isUploading}
          className={`w-full py-4 rounded-xl font-bold transition-all ${isUploading ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {isUploading ? "Uploading..." : "Post Now"}
        </button>
      </form>
    </div>
  );
}

export default SellProduct;