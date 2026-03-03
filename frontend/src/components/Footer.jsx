import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">
              Ramtek <span className="text-blue-500">Bazar</span>
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              A hyper-local marketplace built for the Ramtek community.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <Link
              to="/about"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              Contact
            </Link>

            <Link
              to="/privacy"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              Privacy
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-900 my-8"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          <p>
            © {new Date().getFullYear()} Ramtek Bazar. All rights reserved.
          </p>

          <p className="italic tracking-wide">
            Developed with ❤️ in Ramtek
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;