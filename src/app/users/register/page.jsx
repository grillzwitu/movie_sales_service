'use client'

import { useState } from 'react';
import axios from 'axios';
import styles from '@styles/components/Register.module.css';

/**
 * Handles user registration form logic.
 *
 * @returns {JSX.Element} The registration form component.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '', // Added password2 field
  });

  /**
   * Handles changes in form input fields.
   *
   * @param {Event} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission and user registration.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.password2) {
      console.error('Passwords do not match');
      // Add user-facing error message (optional)
      return; // Prevent form submission
    }

    try {
      const response = await axios.post('/api/users/register', formData);
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <form action="/api/users/register" method="POST" className={styles.form} onSubmit={handleSubmit}>
      <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
      <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
