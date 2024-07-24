import PropTypes from 'prop-types';
import styles from '@styles/components/MovieCard.module.css';
import Image from 'next/image';

/**
 * Renders a single movie card.
 *
 * Displays movie details, including title, genres, and an add to cart button.
 *
 * @param {object} props - Component props.
 * @param {object} props.movie - The movie data.
 * @param {boolean} props.isInCart - Indicates if the movie is in the cart.
 * @param {function} props.addToCart - Function to add the movie to the cart.
 * @param {function} props.removeFromCart - Function to remove the movie from the cart.
 * @returns {JSX.Element} The rendered movie card component.
 */
const MovieCard = ({ movie, isInCart, addToCart, removeFromCart }) => {
  return (
    <div className={styles.card}>
      <Image src={movie.coverImage} alt={movie.title} className={styles.image} width="100" height="100"/>
      <h3>{movie.title}</h3>
      <p>{movie.genres.join(', ')}</p>
      {isInCart ? (
        <button onClick={removeFromCart}>Remove from Cart</button>
      ) : (
        <button onClick={addToCart}>Add to Cart</button>
      )}
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  isInCart: PropTypes.bool.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default MovieCard;
