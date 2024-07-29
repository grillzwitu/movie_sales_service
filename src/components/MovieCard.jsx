import PropTypes from 'prop-types';
import styles from '@styles/components/MovieCard.module.css';
import Image from 'next/image';

const MovieCard = ({ movie, addToCart, removeFromCart, cartItems }) => {
  const isInCart = cartItems.some((item) => item.movieId === movie._id);

  return (
    <div className={styles.card}>
      <Image src={movie.coverImage} alt={movie.title} className={styles.image} width={100} height={100} priority="true" />
      <h3>{movie.title}</h3>
      <p>{movie.genres.join(', ')}</p>
      <button
        onClick={() => (isInCart ? removeFromCart(movie._id) : addToCart({ ...movie, movieId: movie._id }))}
        className="cart-button"
      >
        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired,
};

export default MovieCard;
