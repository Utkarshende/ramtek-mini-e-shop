import React from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 text-slate-500 hover:text-blue-500 text-xs uppercase tracking-widest transition-colors"
        >
          ← Back
        </button>

        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold mb-2">Get in <span className="text-blue-500">Touch</span></h2>
          <p className="text-slate-400 text-sm mb-10">Questions or feedback? We'd love to hear from you.</p>
          
          <div className="space-y-4">
            <a 
              href="mailto:support@ramtekbazar.com" 
              className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all group"
            >
              <span className="text-slate-400 group-hover:text-slate-200">Email Us</span>
              <span className="text-blue-500 font-mono font-bold">support@ramtekbazar.com</span>
            </a>

            <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400">Headquarters</span>
              <span className="text-slate-200 font-bold">Ramtek, Maharashtra</span>
            </div>
          </div>

          <p className="mt-12 text-[10px] text-slate-600 uppercase tracking-[0.3em]">
            Developed by Ramtek Dev Team
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;