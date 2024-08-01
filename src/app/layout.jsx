import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import ClientWrapper from './clientWrapper';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@styles/globals.css';

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <Navbar />
          {children}
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}

export default RootLayout;
