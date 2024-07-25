import { useContext, useState } from 'react';
import { CartContext } from '@context/CartContext';
import styles from '@styles/components/Cart.css';

/**
 * Renders the cart component, displaying cart items, their details, and the total price.
 * Handles image loading errors, price formatting, calculates the total price, and displays an error message
 * if there's an issue loading the cart data.
 *
 * @returns {JSX.Element} The Cart component
 */
function Cart() {
  /**
   * Fetches cart data from the CartContext and stores it in the state.
   */
  const { cart } = useContext(CartContext);

  /**
   * Stores an error message if there's an issue loading the cart data.
   */
  const [error, setError] = useState(null);

  /**
   * Formats the price based on the specified currency and locale.
   *
   * @param {number} price The price to format.
   * @returns {string} The formatted price.
   */
  const formatPrice = (price) => {
    // Implement your logic to format price based on currency and locale
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  /**
   * Calculates the total price of all items in the cart.
   *
   * @returns {number} The total price.
   */
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  /**
   * Calculates the total price and stores it in the state.
   */
  const total = calculateTotal();

  return (
    <div className="cart-container">
      {/* Display error if cart data loading fails */}
      {error ? (
        <p role="alert">Error loading cart: {error}</p>
      ) : (
        <>
          {/* Conditionally render cart items and total based on cart data */}
          {cart.length > 0 ? (
            <>
              {/* Map through cart items and display details */}
              {cart.map((item) => (
                <div key={item.movieId} className="cart-item">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    onError={(event) => {
                      event.target.src = 'placeholder-image.jpg'; // Replace with a placeholder image path
                    }}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p>Price: {formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.movieId)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              {/* Display cart total */}
              <div className="cart-total">
                <h4>Total: {formatPrice(total)}</h4>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
