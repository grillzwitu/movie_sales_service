'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/components/Navbar.module.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <nav className={styles.navbar}>
      <div>
        <Link href="/">Home</Link>
        <Link href="/users/register">Register</Link>
        <Link href="/users/login">Login</Link>
        <Link href="/users/profile">Profile</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/">Logout</Link>
      </div>
      <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
        <button onClick={toggleDropdown}>Menu</button>
        <div className={styles.dropdownContent}>
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/logout">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
