import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.js';
import Register from './pages/RegisterPage.js';
import Home from './pages/Home.js';
import Navbar from './components/Navbar.js';
import ProductDetails from './pages/ProductDetails.js';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/sell" element={<ProtectedRoute><SellProduct /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
export default App;