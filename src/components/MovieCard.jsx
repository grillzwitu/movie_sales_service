import styles from '@styles/components/MovieCard.module.css';

const MovieCard = ({ movie, addToCart }) => {
  return (
    <div className={styles.movieCard}>
      <p>{movie.coverImage}</p>
      <h3>{movie.title}</h3>
      <button onClick={() => addToCart(movie)}>Add to Cart</button>
    </div>
  );
};

export default MovieCard;
