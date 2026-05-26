import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function LoginAndSignupPage() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Navigate to={location.state?.isLogin === false ? "/signup" : "/login"} replace />;
}

export default LoginAndSignupPage;
