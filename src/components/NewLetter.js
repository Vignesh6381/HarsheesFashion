import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="py-20 bg-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Stay in Style</h3>
        <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion tips.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-pink-300 outline-none"
            required
          />
          <button 
            type="submit" 
            className="bg-white text-pink-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;