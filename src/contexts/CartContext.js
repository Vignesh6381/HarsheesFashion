import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
      
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size)
        )
      };
      
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => 
            !(item.id === action.payload.id && item.size === action.payload.size)
          )
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
      
    case 'CLEAR_CART':
      return { ...state, items: [] };
      
    case 'LOAD_CART':
      return { ...state, items: action.payload || [] };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('harshees_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('harshees_cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addToCart = (product, size = 'M', quantity = 1) => {
    try {
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { 
          id: product.id, 
          name: product.name, 
          price: product.price, 
          image: product.image || (product.images && product.images[0] ? product.images[0].url || product.images[0] : null),
          size, 
          quantity 
        } 
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId, size) => {
    try {
      dispatch({ 
        type: 'REMOVE_FROM_CART', 
        payload: { id: productId, size } 
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = (productId, size, quantity) => {
    try {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id: productId, size, quantity: Math.max(0, quantity) } 
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    try {
      return state.items.reduce((total, item) => total + (item.quantity || 0), 0);
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
  };

  const getTotalPrice = () => {
    try {
      return state.items.reduce((total, item) => {
        const price = typeof item.price === 'string' 
          ? parseFloat(item.price.replace('₹', '').replace(',', '')) 
          : item.price || 0;
        return total + (price * (item.quantity || 0));
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };

  const isInCart = (productId, size) => {
    return state.items.some(item => item.id === productId && item.size === size);
  };

  const getCartItemQuantity = (productId, size) => {
    const item = state.items.find(item => item.id === productId && item.size === size);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart,
      getCartItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};