import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, ArrowLeft, Share2, Tag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, getCartItemQuantity } = useCart();
  const { user } = useAuth();

  // Mock product data - in real app, fetch from API
  const allProducts = [
    {
      id: "68ec89018c24dd0886cd0ae5",
      name: "Elegant Evening Dress",
      price: "₹2,499",
      originalPrice: "₹3,999",
      images: [
        "https://images.unsplash.com/photo-1566479179817-c0c1a8eb3eae?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop"
      ],
      rating: 4.8,
      reviews: 127,
      category: "dresses",
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Burgundy'],
      description: "A stunning evening dress perfect for special occasions. Made from premium fabric with elegant draping and a flattering silhouette.",
      features: [
        "Premium quality fabric",
        "Elegant draping design",
        "Perfect for special occasions",
        "Available in multiple colors",
        "Professional dry clean only"
      ],
      specifications: {
        'Material': '95% Polyester, 5% Elastane',
        'Fit': 'Regular',
        'Length': 'Midi',
        'Care': 'Dry clean only',
        'Origin': 'Made in India'
      },
      stock: 8,
      isNew: true,
      tags: ['evening', 'party', 'dress']
    },
    {
      id: "abc123",
      name: "Casual Summer Top",
      price: "₹799",
      originalPrice: "₹1,299",
      images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop"
      ],
      rating: 4.2,
      reviews: 54,
      category: "tops",
      sizes: ['S', 'M', 'L'],
      colors: ['White', 'Blue'],
      description: "Lightweight and breezy top for everyday summer wear.",
      features: [
        "Soft cotton fabric",
        "Relaxed fit",
        "Machine washable"
      ],
      specifications: {
        'Material': '100% Cotton',
        'Fit': 'Relaxed',
        'Length': 'Hip',
        'Care': 'Machine wash',
        'Origin': 'Made in India'
      },
      stock: 3,
      isNew: false,
      tags: ['casual', 'summer', 'top']
    }
  ];

  useEffect(() => {
    // Debug log for ID
    console.log('ProductDetail id param:', id);
    const foundProduct = allProducts.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct({ ...foundProduct, image: foundProduct.images[0] });
    } else {
      setProduct(null);
    }
  }, [id]);

  // Discount percentage
  const getDiscountPercentage = () => {
    if (!product?.originalPrice || !product?.price) return null;
    const original = parseFloat(product.originalPrice.replace(/[₹,]/g, '')) || 0;
    const current = parseFloat(product.price.replace(/[₹,]/g, '')) || 0;
    if (!original || !current || current >= original) return null;
    return Math.round(((original - current) / original) * 100);
  };

  // Stock status
  const getStockStatus = () => {
    if (!product?.stock) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (product.stock <= 5)
      return { text: `Only ${product.stock} left`, color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  // Image error handling
  const handleImageError = () => setImageError(true);
  const getImageUrl = () => {
    if (imageError) return 'https://via.placeholder.com/400x500?text=No+Image';
    return product?.images?.[selectedImage] || 'https://via.placeholder.com/400x500?text=No+Image';
  };

  // Wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsWishlistLoading(true);
    try {
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      // ...existing code...
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Share
  const handleShare = async () => {
    if (!product) return;
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || 'Check out this product!',
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Product link copied!');
      }
    } catch (error) {
      // ...existing code...
    }
  };

  // Add to cart
  const cartQuantity = getCartItemQuantity(product?.id, selectedSize);
  const isProductInCart = cartQuantity > 0;
  const handleAddToCart = async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize);
      }
      setTimeout(() => setIsAdding(false), 800);
    } catch (error) {
      setIsAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Product not found. Please check the product ID.</p>
        </div>
      </div>
    );
  }

  const discountPercentage = getDiscountPercentage();
  const stockStatus = getStockStatus();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-pink-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900 capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 relative">
              <img
                src={getImageUrl()}
                alt={product.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2 z-10">
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
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleWishlistToggle}
                  disabled={isWishlistLoading}
                  className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 ${isWishlisted
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/90 text-gray-600 rounded-full shadow-md hover:bg-gray-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedImage(index); setImageError(false); }}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-pink-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                {discountPercentage && (
                  <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-sm font-medium">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>
              {/* Stock Status */}
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {product.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-b py-6 space-y-4">
              {/* Size Selection */}
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSize === size
                          ? 'border-pink-600 bg-pink-50 text-pink-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className={`flex-1 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isProductInCart
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {isAdding
                  ? 'Adding...'
                  : product.stock === 0
                    ? 'Out of Stock'
                    : isProductInCart
                      ? `In Cart (${cartQuantity})`
                      : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className={`px-6 py-4 border rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-pink-600 bg-pink-50 text-pink-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="h-8 w-8 text-pink-600" />
                  <span className="text-sm font-medium">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RotateCcw className="h-8 w-8 text-pink-600" />
                  <span className="text-sm font-medium">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Shield className="h-8 w-8 text-pink-600" />
                  <span className="text-sm font-medium">Quality Guarantee</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold mb-8">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-medium text-gray-900">{key}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;