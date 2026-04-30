import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrientationWarning from "../components/OrientationWarning";
import Careers from "../components/Careers";
import "./Home.css";

function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <Careers />
      <Footer />
    </div>
  );
}

export default CareersPage;