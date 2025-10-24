import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Phone, 
  Mail, 
  User,
  Package,
  Shield,
  Clock
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = getTotalPrice() > 2000 ? 0 : 99; // Free shipping over ₹2000
  const tax = Math.round(getTotalPrice() * 0.18); // 18% GST
  const discount = getTotalPrice() > 3000 ? Math.round(getTotalPrice() * 0.1) : 0; // 10% discount over ₹3000
  const totalAmount = getTotalPrice() + shippingCost + tax - discount;

  // Pre-fill user info if available
  React.useEffect(() => {
    if (user && step === 1) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, step]);

  const validateShipping = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    return required.every(field => shippingInfo[field].trim() !== '');
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod') return true;
    if (paymentMethod === 'upi') return true;
    if (paymentMethod === 'card') {
      return cardInfo.cardNumber && cardInfo.expiryDate && cardInfo.cvv && cardInfo.cardName;
    }
    return false;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        const orderNum = `HF${Date.now()}`;
        setOrderNumber(orderNum);
        setOrderPlaced(true);
        clearCart();
        setStep(3);
        setProcessing(false);
      }, 2000);
    }
  };

  const handleInputChange = (e, section = 'shipping') => {
    const { name, value } = e.target;
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    } else if (section === 'payment') {
      setCardInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-pink-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in to checkout</h2>
            <p className="text-gray-600">You need to be logged in to place an order</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty and order not placed
  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600">Add some items to your cart before checking out</p>
          </div>
          <Link 
            to="/shop" 
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/shop" 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex-1"></div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{getTotalItems()}</span> items
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((number) => (
              <div key={number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= number 
                    ? 'bg-pink-600 text-white' 
                    : step === number 
                    ? 'bg-pink-100 text-pink-600 border-2 border-pink-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > number ? <CheckCircle className="h-6 w-6" /> : number}
                </div>
                {number < 3 && (
                  <div className={`w-20 h-1 mx-2 ${step > number ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm px-4">
            <span className={step >= 1 ? 'text-pink-600 font-medium' : 'text-gray-600'}>Shipping Details</span>
            <span className={step >= 2 ? 'text-pink-600 font-medium' : 'text-gray-600'}>Payment Method</span>
            <span className={step >= 3 ? 'text-pink-600 font-medium' : 'text-gray-600'}>Order Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Truck className="h-6 w-6 text-pink-600" />
                  Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={shippingInfo.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-pink-600" />
                  Payment Method
                </h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Credit/Debit Card */}
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'card' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-pink-600"
                      />
                      <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </label>

                    {/* UPI */}
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'upi' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-pink-600"
                      />
                      <div className="h-5 w-5 mr-3 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        U
                      </div>
                      <div>
                        <span className="font-medium">UPI Payment</span>
                        <p className="text-sm text-gray-500">Pay using UPI apps like GPay, PhonePe</p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-pink-600"
                      />
                      <Truck className="h-5 w-5 mr-3 text-gray-600" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-medium text-gray-900">Card Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={(e) => handleInputChange(e, 'payment')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={(e) => handleInputChange(e, 'payment')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={(e) => handleInputChange(e, 'payment')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={(e) => handleInputChange(e, 'payment')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Place Order - ₹${totalAmount.toLocaleString('en-IN')}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600">
                    Thank you for your order. You will receive a confirmation email shortly.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Link
                      to="/shop"
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      to="/orders"
                      className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors text-center font-medium"
                    >
                      Track Order
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500">
                    A confirmation email has been sent to {shippingInfo.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {!orderPlaced && (
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold text-pink-600 text-sm">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getTotalItems()} items):</span>
                  <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST):</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-4">
                  <span>Total:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    if (step === 1) {
                      if (validateShipping()) setStep(2);
                    } else if (step === 2) {
                      if (validatePayment()) handlePaymentSubmit(new Event('submit'));
                    }
                  }}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                >
                  {step === 1
                    ? "Continue to Payment"
                    : step === 2
                    ? `Place Order - ₹${totalAmount.toLocaleString('en-IN')}`
                    : "Complete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;