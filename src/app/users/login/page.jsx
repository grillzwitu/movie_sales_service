'use client'

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '@styles/components/Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', formData);
      console.log('Login successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response.data);
      setErrorMessage('Invalid credentials. Please try again.'); // Set error message
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </form>
  );
};

export default Login;
