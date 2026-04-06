import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import useStore from '../store/useStore';

export default function App({ Component, pageProps }) {
  const { user, fetchCart, fetchWishlist } = useStore();

  useEffect(() => {
    if (user) { fetchCart(); fetchWishlist(); }
  }, [user]);

  const noLayout = pageProps.noLayout;

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(124,58,237,0.3)' } }} />
      {!noLayout && <Navbar />}
      <Component {...pageProps} />
      {!noLayout && <Footer />}
    </>
  );
}
