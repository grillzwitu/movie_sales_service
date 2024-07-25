// CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getSession } from 'next/session';

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getCart: () => {},
});

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const initializeCart = async () => {
      const session = await getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Fetch cart from database
        const dbCart = await fetchCartFromDb(userId);
        setCart(dbCart || []);
      } else {
        // Use session cart for unauthenticated users
        const sessionCart = session?.get('cart') || [];
        setCart(sessionCart);
      }
    };

    initializeCart();
  }, []);

  const addToCart = async (movieId) => {
    const session = await getSession();
    const userId = session?.user?.id;
  
    try {
      const response = await fetch(`/api/cart/add_to_cart/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }), // Pass movieId in the request body
      });
  
      if (!response.ok) {
        throw new Error(await response.text()); // Handle errors from API response
      }
  
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (movieId) => {
    const session = await getSession();
    const userId = session?.user?.id;
  
    try {
      const response = await fetch(`/api/cart/delete_from_cart/${movieId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(await response.text()); // Handle errors from API response
      }
  
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getCart = () => cart;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCart }}>
      {children}
    </CartContext.Provider>
  );
};

const fetchCartFromDb = async (userId) => {
    const url = `/api/cart/get_cart/${userId}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
  
    const cartData = await response.json();
    return cartData;
  };
  

export { CartContext, CartProvider };
