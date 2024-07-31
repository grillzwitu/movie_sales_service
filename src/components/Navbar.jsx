'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import styles from '@styles/components/Navbar.module.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items); // Accessing cart items from Redux
  const cartCount = cartItems.length; // Calculating cart item count

  // Toggle dropdown menu
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.dropdown}>
        <button onClick={toggleDropdown}>Menu</button>
        <div
          className={`${styles.dropdownContent} ${isDropdownOpen ? styles.open : ''}`}
        >
          <Link href="/">Home</Link>
          <Link href="/users/register">Register</Link>
          <Link href="/users/login">Login</Link>
          <Link href="/cart">Cart <sup>{cartCount}</sup></Link>
        </div>
      </div>
      {isDropdownOpen ? null : (
        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/users/register">Register</Link>
          <Link href="/users/login">Login</Link>
          <Link href="/cart">Cart <sup>{cartCount}</sup></Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
