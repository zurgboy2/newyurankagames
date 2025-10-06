import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import { useEffect } from "react";
import VideoGamesSection from "../components/VideoGames";
import OrientationWarning from "../components/OrientationWarning";
import FAQSection from "../components/FAQ";

function VideoGamesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <VideoGamesSection />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default VideoGamesPage;
