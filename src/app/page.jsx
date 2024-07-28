'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '@components/MovieCard';
import styles from '@styles/globals.css';
import { useSelector, useDispatch } from 'react-redux';
import { setMovies, addToCart, removeFromCart } from '../store/cartSlice';

const HomePage = () => {
  const movies = useSelector((state) => state.cart.movies);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies', {
          cancelToken: source.token,
        });
        dispatch(setMovies(response.data));
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setError('Failed to fetch movies');
          console.error('Failed to fetch movies:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      source.cancel('Component unmounted or request canceled.');
    };
  }, [dispatch]);

  const handleAddToCart = (movie) => {
    dispatch(addToCart(movie));
  };

  const handleRemoveFromCart = (movieId) => {
    dispatch(removeFromCart(movieId));
  };

  return (
    <section className={styles.movieContainer}>
      {loading && <p>Loading movies...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies && movies.length === 0 && <p>No movies available at the moment.</p>}
      {!loading && !error && movies && movies.length > 0 && (
        <article style={{ padding: "20px"}}>
          <h2>Movies</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
                cartItems={cartItems} // Pass cartItems to MovieCard
              />
            ))}
          </div>
        </article>
      )}
    </section>
  );
};

export default HomePage;
