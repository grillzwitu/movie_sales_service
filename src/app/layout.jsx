import { CartProvider } from '@context/CartContext';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import '@styles/globals.css';

/**
 * Defines the root layout for the application, providing a structure for pages.
 * Wraps the application content with the CartProvider to make cart context available.
 *
 * @param {object} children - The children components to be rendered within the layout.
 * @returns {JSX.Element} The root layout structure.
 */
const RootLayout = ({ children }) => {
  return (
    <html lang='en'>
      <body>
        {/* Wraps the application content with the CartProvider to make cart context accessible */}
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
};

export default RootLayout;
