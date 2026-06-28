import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrientationWarning from "../components/OrientationWarning";
import BuyoutForm from "../components/BuyoutForm";
import "./BuyoutPage.css";
import { useEffect } from "react";

function BuyoutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="BuyoutPage">
      <OrientationWarning />
      <Navbar />
      <BuyoutForm />
      <Footer />
    </div>
  );
}

export default BuyoutPage;