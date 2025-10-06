import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "./Login&Signup.css";
import { makeRequestCall } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";

const LoginAndSignup = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!isLogin && formData.username.length > 2) {
      const timeout = setTimeout(async () => {
        setCheckingUsername(true);
        try {
          const username = formData.username;
          const data = await makeRequestCall("auth_script", "check_username", {
            username,
          });

          if (data.available) {
            setUsernameAvailable(data.available);
            setCheckingUsername(null);
          } else {
            setUsernameAvailable(null);
            setCheckingUsername(null);
          }
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameAvailable(null);
        } finally {
          setCheckingUsername(false);
        }
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setUsernameAvailable(null);
    }
  }, [formData.username, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiEndpoint = isLogin ? "customerLogin" : "signUp";
    const requestData = isLogin
      ? { username: formData.username, password: formData.password }
      : { ...formData };

    try {
      const data = await makeRequestCall(
        "auth_script",
        apiEndpoint,
        requestData
      );

      if (data.success) {
        if (isLogin) {
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("googleToken", data.googleToken);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("avatarurl", data.image_url);
          alert("Logged in!");
          navigate("/");
        } else {
          alert("Sign up successful! Please log in.");
          setIsLogin(true);
        }
      } else {
        alert(data.message || "Request failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <p>{isLogin ? "Welcome back!" : null}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Name</label>
              <div className="input-field">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Username</label>
            <div className="input-field">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Enter your username"
                required
                value={formData.username}
                name="username"
                onChange={handleChange}
              />
            </div>

            {!isLogin && username.length > 2 && (
              <p
                className={
                  checkingUsername
                    ? "username-feedback checking"
                    : usernameAvailable
                    ? "username-feedback available"
                    : "username-feedback unavailable"
                }
              >
                {checkingUsername
                  ? "Checking availability..."
                  : usernameAvailable
                  ? "Username is available"
                  : "Username is already taken"}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Email</label>
              <div className="input-field">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-field">
                <FaLock className="icon" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-button">
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default LoginAndSignup;
