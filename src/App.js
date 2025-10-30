import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
// import SearchBar from "./components/Searchbar";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/searchbar" element={<SearchBar />} /> */}

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">
                        <h1 className="text-2xl font-bold">Profile Page</h1>
                        <p className="text-gray-600 mt-4">Coming soon...</p>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">
                        <h1 className="text-2xl font-bold">My Orders</h1>
                        <p className="text-gray-600 mt-4">Coming soon...</p>
                      </div>
                    </ProtectedRoute>
                  }
                />
                {/* 404 Page */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-300 mb-4">
                          404
                        </h1>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          Page Not Found
                        </h2>
                        <p className="text-gray-600 mb-8">
                          The page you're looking for doesn't exist.
                        </p>
                        <a
                          href="/"
                          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                        >
                          Go Back Home
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
