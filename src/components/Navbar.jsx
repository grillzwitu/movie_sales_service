'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styles from '@styles/components/Navbar.module.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const user = useSelector((state) => state.user.user); // Assuming user state is in the user slice
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

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
