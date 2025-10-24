// src/components/ProductCard/ProductCard.js
import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Share2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onAddToCart, viewMode = 'grid' }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { addToCart, getCartItemQuantity } = useCart();
  const { user } = useAuth();

  // ✅ Handles add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    try {
      addToCart(product, selectedSize);
      if (onAddToCart) onAddToCart(product);
      setTimeout(() => setIsAdding(false), 800);
    } catch (error) {
      console.error('Add to cart error:', error);
      setIsAdding(false);
    }
  };

  // ✅ Wishlist toggle (placeholder)
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsWishlistLoading(true);
    try {
      // Example placeholder for wishlist API
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Wishlist error:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // ✅ Share functionality
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || 'Check out this saree!',
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Product link copied!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // ✅ Discount percentage (based on new backend price fields)
  const getDiscountPercentage = () => {
    if (!product.originalPrice || !product.price) return null;
    const original = parseFloat(product.originalPrice.replace(/[₹,]/g, '')) || 0;
    const current = parseFloat(product.price.replace(/[₹,]/g, '')) || 0;
    if (!original || !current || current >= original) return null;
    return Math.round(((original - current) / original) * 100);
  };

  // ✅ Stock status
  const getStockStatus = () => {
    if (product.stock === 0)
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (product.stock <= 5)
      return { text: `Only ${product.stock} left`, color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  // ✅ Image handling
  const handleImageError = () => setImageError(true);
  const getImageUrl = () => {
    if (imageError) return 'https://via.placeholder.com/400x500?text=No+Image';
    return product.image || 'https://via.placeholder.com/400x500?text=No+Image';
  };


  const stockStatus = getStockStatus();
  const discountPercentage = getDiscountPercentage();
  const cartQuantity = getCartItemQuantity(product.id, selectedSize);
  const isProductInCart = cartQuantity > 0;

  // ✅ Grid layout (default)
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={getImageUrl()}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* ✅ Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
              New
            </span>
          )}
          {discountPercentage && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* ✅ Action buttons */}
        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 ${isInWishlist
                ? 'bg-pink-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
              }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 text-gray-600 rounded-full shadow-md hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* ✅ Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 backdrop-blur-sm ${isAdding
                ? 'bg-green-500/90 text-white'
                : product.stock === 0
                  ? 'bg-gray-500/90 text-white cursor-not-allowed'
                  : isProductInCart
                    ? 'bg-pink-600/90 text-white'
                    : 'bg-white/90 text-gray-900 hover:bg-white'
              }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {isAdding
              ? 'Adding...'
              : product.stock === 0
                ? 'Out of Stock'
                : isProductInCart
                  ? `In Cart (${cartQuantity})`
                  : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* ✅ Category Tag */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category || 'Uncategorized'}
          </span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors line-clamp-2 text-sm">
            {product.name}
          </h3>
        </Link>

        {/* ✅ Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* ✅ Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 flex-wrap">
              {product.sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`text-xs px-2 py-1 border rounded transition-colors ${selectedSize === size
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ✅ Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 ${isAdding
              ? 'bg-green-500 text-white'
              : product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isProductInCart
                  ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {isAdding
            ? 'Adding...'
            : product.stock === 0
              ? 'Out of Stock'
              : isProductInCart
                ? `In Cart (${cartQuantity})`
                : 'Add to Cart'}
        </button>

        {/* ✅ Stock Status */}
        <div className="mt-2 text-center">
          <span
            className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}
          >
            {stockStatus.text}
          </span>
        </div>

        {/* ✅ Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            <Tag className="h-3 w-3 text-gray-400" />
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
