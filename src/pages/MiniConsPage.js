import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MiniCons from "../components/MiniCons";
import "./Home.css";
import OrientationWarning from "../components/OrientationWarning";

function MiniConsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <MiniCons />
      <Footer />
    </div>
  );
}

export default MiniConsPage;
