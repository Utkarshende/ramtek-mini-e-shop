import React from 'react';
import { useNavigate } from 'react-router-dom';

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-500 hover:text-blue-500 text-sm mb-8 flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8 tracking-tight">
          Privacy <span className="text-blue-500">Policy</span>
        </h1>

        <div className="space-y-8 text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">1. Information We Collect</h2>
            <p>
              We collect basic information required to list your products, such as your name, 
              phone number, and product images. Your phone number is made public so that 
              potential buyers can contact you via WhatsApp or Call.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">2. How We Use Data</h2>
            <p>
              Your data is used solely to display your listings on **Ramtek Bazar**. We do not 
              sell, trade, or share your personal information with third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">3. Image Storage</h2>
            <p>
              Product images are securely stored on **Cloudinary**. By uploading an image, 
              you confirm that you have the right to share that content publicly.
            </p>
          </section>

          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-blue-400 mb-2">User Responsibility</h2>
            <p className="text-sm">
              As a hyper-local marketplace, users are responsible for the safety of their 
              transactions. Always meet in public places (like near the Ramtek Bus Stand) 
              when exchanging goods.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-slate-600 italic">
          Last Updated: February 2026
        </p>
      </div>
    </div>
  );
}

export default Privacy;