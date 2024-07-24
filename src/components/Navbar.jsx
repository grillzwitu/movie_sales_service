'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@styles/components/Navbar.module.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user and cart details (assuming these are stored in session/local storage)
    const userData = JSON.parse(localStorage.getItem('user'));
    const cartData = JSON.parse(localStorage.getItem('cart'));

    if (userData) {
      setUser(userData);
    }

    if (cartData) {
      setCartCount(cartData.length);
    }
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>
        {user ? (
          <>
            <Link href="/users/profile">Profile</Link>
            <Link href="/cart">Cart <sup>{cartCount}</sup></Link>
            <Link href="/logout">Logout</Link>
            <span>{user.firstName}</span>
          </>
        ) : (
          <>
            <Link href="/users/register">Register</Link>
            <Link href="/users/login">Login</Link>
          </>
        )}
      </div>
      <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
        <button onClick={toggleDropdown}>Menu</button>
        <div className={styles.dropdownContent}>
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/users/profile">Profile</Link>
              <Link href="/cart">Cart <sup>{cartCount}</sup></Link>
              <Link href="/logout">Logout</Link>
              <span>{user.firstName}</span>
            </>
          ) : (
            <>
              <Link href="/users/register">Register</Link>
              <Link href="/users/login">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
