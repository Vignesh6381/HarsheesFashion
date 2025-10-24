// src/pages/Shop/Shop.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, Grid, List, Search, X, Loader, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ---------- State ----------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // ---------- Filter Options ----------
  const priceRanges = [
    { value: 'all', label: 'All Prices', min: 0, max: Infinity },
    { value: '0-1000', label: 'Under ₹1,000', min: 0, max: 1000 },
    { value: '1000-2000', label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { value: '2000-4000', label: '₹2,000 - ₹4,000', min: 2000, max: 4000 },
    { value: '4000+', label: 'Above ₹4,000', min: 4000, max: Infinity }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  // ---------- Sync URL Filters ----------
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const price = searchParams.get('price') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;

    setSearchQuery(search);
    setSelectedCategory(category);
    setPriceRange(price);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  // ---------- Load Categories ----------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories([{ _id: 'all', name: 'All Categories' }, ...data.data]);
        }
      } catch (err) {
        console.error('Category fetch error:', err);
      }
    };
    loadCategories();
  }, []);

  // ---------- Load Products ----------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          sort: sortBy
        });

        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);

        if (priceRange !== 'all') {
          const range = priceRanges.find(r => r.value === priceRange);
          if (range.min > 0) params.append('minPrice', range.min);
          if (range.max !== Infinity) params.append('maxPrice', range.max);
        }

        const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          const transformedProducts = data.data.products.map(product => ({
            id: product._id,
            name: product.name,
            description: product.description,
            shortDescription: product.description?.slice(0, 80) + '...',
            price: `₹${product.price.toLocaleString('en-IN')}`,
            originalPrice: product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : null,
            image: product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image',
            images: product.images || [],
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            isNew: product.isNewProduct || false,   // ✅ your backend uses isNewProduct
            isFeatured: product.isFeatured || false,
            category: product.category?.name || 'Uncategorized',
            categoryId: product.category?._id,
            sizes: product.sizes?.map(s => s.size) || ['Free Size'],
            stock: product.stock || 0,
            sku: product.sku || '',
            tags: product.category?.metaTags || []
          }));

          setProducts(transformedProducts);
          setPagination(data.data.pagination);
        }
        else {
          setError(data.message || 'Failed to load products.');
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        setError('Server connection failed.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, priceRange, sortBy, searchQuery, currentPage]);

  // ---------- Update URL ----------
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage);

    navigate(`/shop?${params.toString()}`, { replace: true });
  }, [selectedCategory, priceRange, sortBy, searchQuery, currentPage, navigate]);

  // ---------- Handlers ----------
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('newest');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (searchQuery) count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest saree and fashion collections crafted for elegance and comfort.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto lg:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sarees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </form>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`bg-white p-6 rounded-lg shadow-sm h-fit ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Filters</h3>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              <button onClick={clearAllFilters} className="text-sm text-pink-600 hover:text-pink-700">
                Clear All
              </button>
            </div>

            {/* Sort */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat._id}
                        checked={selectedCategory === cat._id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-gray-700 text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-gray-700 text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <main className="lg:col-span-3">
            {/* Top Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                {loading ? 'Loading...' : `${pagination.totalProducts} products found`}
                {searchQuery && <span className="text-sm text-gray-500">for “{searchQuery}”</span>}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" /> Filters
                </button>

                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded border ${viewMode === 'grid' ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 text-gray-600'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    className={`p-2 rounded border ${viewMode === 'list' ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 text-gray-600'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            {loading && (
              <div className="text-center py-12">
                <Loader className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-3" />
                <p>Loading products...</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12 bg-white rounded-lg">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} viewMode={viewMode} onAddToCart={() => addToCart(p)} />
                ))}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No sarees match your filters.</p>
                <button onClick={clearAllFilters} className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${page === currentPage
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
