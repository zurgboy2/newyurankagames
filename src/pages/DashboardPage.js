import { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserDashboard from "../components/UserDashboard";
import "./Home.css";
import OrientationWarning from "../components/OrientationWarning";

function DashboardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <UserDashboard />
      <Footer />
    </div>
  );
}

export default DashboardPage;
