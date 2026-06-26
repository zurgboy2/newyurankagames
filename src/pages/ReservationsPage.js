import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReservationForm from "../components/ReservationForm";
import { useEffect } from "react";
import OrientationWarning from "../components/OrientationWarning";
import FAQSection from "../components/FAQ";

function ReservationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OrientationWarning />
      <Navbar />
      <ReservationForm />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default ReservationsPage;
