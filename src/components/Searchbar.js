import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchBar = ({ allProducts, isOpen, onToggle }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, allProducts]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    setShowResults(false);
    onToggle();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-pink-500 outline-none text-lg"
              />
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {showResults && (
            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                        <p className="text-pink-600 font-semibold">{product.price}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t mt-2 pt-2 px-4">
                    <Link
                      to={`/shop?search=${query}`}
                      onClick={handleClose}
                      className="text-pink-600 hover:text-pink-700 text-sm"
                    >
                      See all results for "{query}"
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;