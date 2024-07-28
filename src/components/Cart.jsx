'use client'

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import styles from '@styles/components/Cart.module.css';
import { removeFromCart } from '../store/cartSlice';

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const total = calculateTotal();

  const handleRemoveFromCart = (movieId) => {
    dispatch(removeFromCart(movieId));
  };

  return (
    <div className="cart-container">
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item.movieId} className="cart-item">
              <Image
                src={item.coverImage}
                alt={item.title}
                onError={(event) => {
                  event.target.src = 'placeholder-image.jpg';
                }}
                className="cart-item-image"
                width={100} // Adjust width as needed
                height={100} // Adjust height as needed
              />
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>Price: {formatPrice(item.price)}</p>
              </div>
              <button onClick={() => handleRemoveFromCart(item.movieId)} className="remove-button">
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h4>Total: {formatPrice(total)}</h4>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
