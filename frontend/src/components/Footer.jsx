import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-10 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-slate-500 text-xs tracking-[0.2em] uppercase mb-6">
          © {new Date().getFullYear()} Ramtek Bazar • Built for the Community
        </div>
        
        <div className="flex justify-center items-center gap-8 text-slate-400 text-sm font-medium">
          <Link 
            to="/about" 
            className="hover:text-blue-500 transition-all duration-300"
          >
            About
          </Link>
          
          <Link 
            to="/contact" 
            className="hover:text-blue-500 transition-all duration-300"
          >
            Contact
          </Link>
          
          <Link 
            to="/privacy" 
            className="hover:text-blue-500 transition-all duration-300"
          >
            Privacy
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900/50">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest italic">
            Developed with ❤️ in Ramtek
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;