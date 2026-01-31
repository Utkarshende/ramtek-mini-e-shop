import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.jsx';
import Register from './pages/RegisterPage.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import SellProduct from './pages/SellProduct.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sell" element={<ProtectedRoute><SellProduct /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
export default App;