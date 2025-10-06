import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrientationWarning from "../components/OrientationWarning";
import "./Home.css";

import { useEffect } from "react";
import BoardGamesSection from "../components/BoardGames";
import FAQSection from "../components/FAQ";

function BoardGamesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <BoardGamesSection />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default BoardGamesPage;
