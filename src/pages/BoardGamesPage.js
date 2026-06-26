import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrientationWarning from "../components/OrientationWarning";

import { useEffect } from "react";
import BoardGamesSection from "../components/BoardGames";
import FAQSection from "../components/FAQ";

function BoardGamesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OrientationWarning />
      <Navbar />
      <BoardGamesSection />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default BoardGamesPage;
