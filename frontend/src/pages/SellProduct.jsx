import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api.js';
import { CATEGORIES } from '../config/constants.js';

function SellProduct() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', 
    price: '', 
    category: 'Electronics', 
    description: '', 
    location: '', 
    phoneNumber: ''
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
      const response = await API.post('/products/create', data);
      
      const newId = response.data.data._id;
      
      alert("Product listed successfully!");
      navigate(`/product/${newId}`); 
      
    } catch (err) {
      console.error("Upload Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Error uploading. Make sure all fields are filled.");
    } finally {
      setIsUploading(false);
    }
  };  

  return (    
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center text-white font-sans">
      
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold italic tracking-tight">RAMTEK <span className="text-blue-500">BAZAR</span></h2>
          <p className="text-slate-400 text-sm mt-1">Sell your items to locals instantly.</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Product Photos (Max 5)</label>
          <div className="flex flex-wrap gap-4 p-5 bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors">
            <label className="w-24 h-24 bg-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 transition-all group">
              <span className="text-3xl text-slate-400 group-hover:text-blue-400 transition-colors">+</span>
              <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Add</span>
              <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>

            {previews.map((url, i) => (
              <div key={i} className="relative w-24 h-24 group animate-in fade-in zoom-in duration-300">
                <img src={url} className="w-full h-full object-cover rounded-2xl border border-slate-700 shadow-lg" alt="preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Item Title</label>
            <input type="text" placeholder="e.g. iPhone 13 Pro" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Price (₹)</label>
            <input type="number" placeholder="Enter amount" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          </div>
          
       <div className="space-y-2">
  <label className="text-xs text-slate-500 uppercase font-bold ml-1">
    Category
  </label>

  <select
    value={formData.category}
    onChange={(e) =>
      setFormData({ ...formData, category: e.target.value })
    }
    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
  >
    {CATEGORIES.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>


          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Location</label>
            <input type="text" placeholder="e.g. Near Ram Temple" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-500 uppercase font-bold ml-1">Phone Number</label>
          <input type="text" placeholder="WhatsApp or Call number" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-slate-500 uppercase font-bold ml-1">Description</label>
          <textarea placeholder="Describe condition, age, etc..." className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-32 transition-all resize-none" 
            onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        </div>




        <button 
          disabled={isUploading}
          className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.98] ${isUploading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'}`}
        >
          {isUploading ? "LISTING YOUR ITEM..." : "POST MY AD"}
        </button>
      </form>
    </div>
  );
}

export default SellProduct;