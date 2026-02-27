import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import SellProduct from "./pages/SellProduct.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyListings from "./pages/MyListings.jsx";
import SellerProfile from "./pages/SellerProfile.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/seller/:id" element={<SellerProfile />} />

            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellProduct />s
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        <Footer />

        {/* ✅ Toast Notification Container */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;