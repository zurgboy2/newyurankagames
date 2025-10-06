import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import ReservationForm from "../components/ReservationForm";
import { useEffect } from "react";
import OrientationWarning from "../components/OrientationWarning";
import FAQSection from "../components/FAQ";

function ReservationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <ReservationForm />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default ReservationsPage;
