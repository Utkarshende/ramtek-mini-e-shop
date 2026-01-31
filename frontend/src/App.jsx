import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import our custom components and pages
import Navbar from './components/Navbar.js'
import Home from './pages/Home.js'
import SellProduct from './pages/SellProduct.js'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        
        {/* Navbar is outside <Routes> so it stays at the top of every page */}
        <Navbar />

        {/* This area changes based on the URL path */}
        <main>
          <Routes>
            {/* http://localhost:3000/ */}
            <Route path="/" element={<Home />} />

            {/* http://localhost:3000/sell */}
            <Route path="/sell" element={<SellProduct />} />
          </Routes>
        </main>

      </div>
    </Router>
  )
}

export default App