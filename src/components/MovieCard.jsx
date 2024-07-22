import styles from '@styles/components/MovieCard.module.css';

const MovieCard = ({ movie, addToCart }) => {
  return (
    <div className={styles.movieCard}>
      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
      <button onClick={() => addToCart(movie)}>Add to Cart</button>
    </div>
  );
};

export default MovieCard;
