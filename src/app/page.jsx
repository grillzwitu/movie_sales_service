'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RootLayout from './layout';
import MovieCard from '@components/MovieCard';
import styles from '@styles/globals.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies on component mount
  useEffect(() => {
    // Create a cancellation token source
    const source = axios.CancelToken.source();

    // Define an async function to fetch movies
    const fetchMovies = async () => {
      try {
        // Make the API call to fetch movies
        const response = await axios.get('/api/movies', {
          cancelToken: source.token, // Attach the cancellation token to the request
        });
        if (response.data) {
          // Update the movies state with the fetched data
          setMovies(response.data);
        } else {
          // If no data is returned, set movies to an empty array
          setMovies([]);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          // Handle errors by setting the error state
          setError('Failed to fetch movies');
          console.error('Failed to fetch movies:', error);
        }
      } finally {
        // Stop the loading indicator
        setLoading(false);
      }
    };

    // Call the fetchMovies function
    fetchMovies();

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      source.cancel('Component unmounted or request canceled.');
    };
  }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

  // Function to add a movie to the cart
  const addToCart = (movie) => {
    // Update the cart state with the new movie
    setCart((prevCart) => [...prevCart, movie]);
  };

  return (
      <section className={styles.movieContainer}>
        {loading && <p>Loading movies...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && movies.length === 0 && <p>No movies available at the moment.</p>}
        {!loading && !error && movies.length > 0 && movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} addToCart={addToCart} />
        ))}
      </section>
  );
};

export default HomePage;
