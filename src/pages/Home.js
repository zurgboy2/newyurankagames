import AboutUs from "../components/AboutUs";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import OurServices from "../components/OurServices";
import Footer from "../components/Footer";
import "./Home.css";
import { useEffect } from "react";
import EventsLandingPageSection from "../components/EventsLanding";
import FAQSection from "../components/FAQ";
import OrientationWarning from "../components/OrientationWarning";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <Hero />
      <AboutUs />
      <OurServices />
      <EventsLandingPageSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

export default Home;
