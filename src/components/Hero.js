import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
let motion;
try {
  // Import framer-motion safely
  motion = require('framer-motion').motion;
} catch {
  motion = { div: (props) => <div {...props} /> };
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-white to-purple-50 py-20">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Style That <span className="text-pink-600">Speaks Elegance</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Explore Harshee’s exclusive collection — from premium <span className="font-semibold text-gray-800">sarees</span> and elegant dresses 
              to stylish accessories crafted to enhance your confidence and grace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center font-medium shadow-md"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>

              <Link
                to="/collections"
                className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg hover:bg-pink-600 hover:text-white transition-colors font-medium"
              >
                View Collection
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=900&fit=crop"
              alt="Elegant Saree Collection"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />

            <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-pink-100">
              <p className="text-xs text-gray-500">Now Trending</p>
              <p className="text-lg font-semibold text-gray-900">Festive Collection 2025</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
