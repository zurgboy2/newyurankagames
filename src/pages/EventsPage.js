import EventsSection from '../components/Events';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Home.css';
import OrientationWarning from '../components/OrientationWarning';
import FAQSection from '../components/FAQ';

function EventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <EventsSection />
      <FAQSection filter="events" />
      <Footer />
    </>
  );
}

export default EventsPage;
