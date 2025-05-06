import EventsSection from '../components/Events';
import React, { useEffect } from 'react';
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
    <div className="Home">
    <OrientationWarning />
    <Navbar/>
    <EventsSection/>
    <FAQSection filter='events'/>
    <Footer/>    
    </div>
  );
}

export default EventsPage;