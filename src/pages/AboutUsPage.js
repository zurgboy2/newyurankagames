import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutYuranka from '../components/AboutYuranka';
import { useEffect } from 'react';
import FAQSection from '../components/FAQ';
import OrientationWarning from '../components/OrientationWarning';

function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <AboutYuranka />
      <FAQSection />
      <Footer />
    </>
  );
}

export default AboutUsPage;
