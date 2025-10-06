import { useEffect } from "react";
import Navbar from "../components/Navbar";
import LoginAndSignup from "../components/Login&Signup";
import Footer from "../components/Footer";
import "./Home.css";
import OrientationWarning from "../components/OrientationWarning";

function LoginAndSignupPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Home">
      <OrientationWarning />
      <Navbar />
      <LoginAndSignup />
      <Footer />
    </div>
  );
}

export default LoginAndSignupPage;
