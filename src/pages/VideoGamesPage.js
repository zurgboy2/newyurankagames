import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import VideoGamesSection from "../components/VideoGames";
import OrientationWarning from "../components/OrientationWarning";
import FAQSection from "../components/FAQ";

function VideoGamesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OrientationWarning />
      <Navbar />
      <VideoGamesSection />
      <FAQSection filter="games" />
      <Footer />
    </div>
  );
}

export default VideoGamesPage;
