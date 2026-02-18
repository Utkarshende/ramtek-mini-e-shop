import React from 'react'

function Contact() {
  return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Get in <span className="text-blue-500">Touch</span></h2>
        <p className="text-slate-400 mb-8">Have questions or facing issues with your listing? We are here to help.</p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-400 italic">Email Support</span>
            <a href="mailto:support@ramtekbazar.com" className="text-blue-400 font-bold">support@ramtekbazar.com</a>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-400 italic">Location</span>
            <span className="text-white font-bold">Ramtek, Maharashtra</span>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Developer</p>
          <p className="text-sm">Built with ❤️ for the community.</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
