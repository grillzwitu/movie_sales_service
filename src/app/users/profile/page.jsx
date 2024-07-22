'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@styles/components/Profile.module.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfileData(response.data);
        setFormData({ ...response.data, password: '' });
      } catch (error) {
        console.error('Failed to fetch profile:', error.response.data);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/profile', formData);
      console.log('Profile update successful:', response.data);
    } catch (error) {
      console.error('Profile update failed:', error.response.data);
    }
  };

  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      <form action="" method="" className={styles.form} onSubmit={handleSubmit}>
        <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
        <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="New Password" onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
