// src/pages/Home/Home.js - Update to fetch real data
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/NewLetter';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getFeaturedProducts(),
        fetch('http://localhost:5000/api/categories')
      ]);
      
      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);
      
      if (productsData.success) {
        setFeaturedProducts(productsData.data);
      }
      
      if (categoriesData.success) {
        setCategories(categoriesData.data.slice(0, 5)); // First 3 categories
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of fashion categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category._id} className="group relative overflow-hidden rounded-2xl cursor-pointer">
                <img 
                  src={category.image?.url || 'https://via.placeholder.com/300x400'} 
                  alt={category.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">{category.name}</h4>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked items from our latest collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={{
                  id: product._id,
                  name: product.name,
                  price: `₹${product.price.toLocaleString('en-IN')}`,
                  originalPrice: product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : null,
                  image: product.images?.[0]?.url,
                  rating: product.rating,
                  isNew: product.isNew,
                  sizes: product.sizes?.map(s => s.size) || ['M']
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;