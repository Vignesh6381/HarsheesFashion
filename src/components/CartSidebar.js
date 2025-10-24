import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';  
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (!isOpen) return null;

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, size);
    } else {
      updateQuantity(id, size, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    // Navigation to checkout will be handled by Link component
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-pink-600" />
              Shopping Cart
              {getTotalItems() > 0 && (
                <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {getTotalItems()}
                </span>
              )}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some items to get started</p>
                <button 
                  onClick={onClose}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-lg font-semibold text-pink-600">{item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 bg-white rounded border font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-2 hover:bg-gray-200 rounded-full h-fit transition-colors"
                        title="Remove item"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <div className="mt-2 text-sm font-medium text-gray-900">
                        ₹{(parseFloat(item.price.replace('₹', '').replace(',', '')) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Clear Cart Button */}
                {cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-red-600 hover:text-red-700 py-2 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              {/* Subtotal */}
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items):</span>
                <span className="font-medium">₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
              
              {/* Shipping Info */}
              <div className="text-sm text-gray-500">
                {getTotalPrice() >= 2000 ? (
                  <p className="text-green-600">🎉 Free shipping on this order!</p>
                ) : (
                  <p>Add ₹{(2000 - getTotalPrice()).toLocaleString('en-IN')} more for free shipping</p>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total:</span>
                <span className="text-pink-600">₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
              
              {/* Checkout Button */}
              <Link
                to="/checkout"
                onClick={handleCheckout}
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;