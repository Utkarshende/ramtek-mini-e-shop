import React from 'react'

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center">
      <div className="text-slate-500 text-sm tracking-widest uppercase">
        © 2026 Ramtek Bazar • Built for the Community
      </div>
      <div className="flex justify-center gap-6 mt-4 text-slate-400 text-xs">
        <a href="/about" className="hover:text-white transition-colors">About</a>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
    </footer>
  )
}

export default Footer;a