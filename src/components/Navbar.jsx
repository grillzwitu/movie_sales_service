'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '@styles/components/Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items); // Accessing cart items from Redux
  const cartCount = cartItems.length; // Calculating cart item count

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" legacyBehavior>
          <a className={styles.navbarLogo}>Logo</a>
        </Link>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className={isOpen ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>
          <li className={styles.navItem}>
            <Link href="/" legacyBehavior>
              <a className={styles.navLinks}>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/users/register" legacyBehavior>
              <a className={styles.navLinks}>Register</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/users/login" legacyBehavior>
              <a className={styles.navLinks}>Login</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/cart" legacyBehavior>
              <a className={styles.navLinks}>Cart <sup>{cartCount}</sup></a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
