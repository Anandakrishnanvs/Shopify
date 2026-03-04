import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      if (currentUser && currentUser._id) {
        const localData = localStorage.getItem(`cart_${currentUser._id}`);
        return localData ? JSON.parse(localData) : [];
      }
      return [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    if (user && user._id) {
      const localData = localStorage.getItem(`cart_${user._id}`);
      setCartItems(localData ? JSON.parse(localData) : []);
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (items) => {
    if (user && user._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity, size, color) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      let newItems;
      if (existingItem) {
        toast.success('Item  updated in cart');
        newItems = prevItems.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success('Item added to cart');
        newItems = [...prevItems, { ...product, quantity, selectedSize: size, selectedColor: color }];
      }
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color));
      saveCart(newItems);
      return newItems;
    });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          item.id === productId && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity }
            : item
        );
        saveCart(newItems);
        return newItems;
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};