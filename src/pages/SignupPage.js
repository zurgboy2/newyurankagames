import { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import OrientationWarning from '../components/OrientationWarning';
import Signup from '../components/Signup';

function SignupPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <Signup />
      <Footer />
    </>
  );
}

export default SignupPage;
