import { useEffect } from 'react';
import Footer from '../components/Footer';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import OrientationWarning from '../components/OrientationWarning';

function LoginPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <Login />
      <Footer />
    </>
  );
}

export default LoginPage;
