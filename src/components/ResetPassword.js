import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import { makeRequestCall } from "../api/api";
import "./ResetPassword.css";

/**
 * ResetPassword component styled to match the Login/Sign Up page.
 * - mode "request": enter email or username to request a reset link
 * - mode "reset": token present -> verify token then allow setting new password
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [mode, setMode] = useState(token ? "reset" : "request");
  const [identifier, setIdentifier] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (token) {
      (async () => {
        setLoadingMode("verify");
        try {
          const res = await makeRequestCall("auth_script", "verifyResetToken", {
            token,
          });
          setVerifyStatus(res);
        } catch (err) {
          console.error(err);
          setVerifyStatus({ success: false, message: "Verification failed" });
        } finally {
          setLoadingMode("");
        }
      })();
    }
  }, [token]);

  const handleRequest = async (e) => {
    e && e.preventDefault();
    if (!identifier) {
      alert("Please enter your email or username");
      return;
    }
    setRequestLoading(true);
    try {
      const res = await makeRequestCall("auth_script", "requestPasswordReset", {
        emailOrUsername: identifier,
      });
      alert(res.message || "If an account exists, an email will be sent.");
      navigate("/login&signup");
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReset = async (e) => {
    e && e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoadingMode("save");
    try {
      const res = await makeRequestCall("auth_script", "resetPassword", {
        token,
        newPassword,
      });
      if (res.success) {
        alert("Password updated. Please log in.");
        navigate("/login&signup");
      } else {
        alert(res.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    } finally {
      setLoadingMode("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {mode === "request" && (
          <>
            <h2>Forgot Password</h2>
            <p>
              Enter your email or username and we'll send a password reset link
              if an account exists.
            </p>

            <form onSubmit={handleRequest}>
              <div className="input-group">
                <label>Email or Username</label>
                <div className="input-field">
                  <FaEnvelope className="icon" />
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or username"
                    style={{ color: "white" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={requestLoading}
              >
                {requestLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p
              className="toggle-text"
              style={{ marginTop: 12, cursor: "pointer" }}
              onClick={() => navigate("/login&signup")}
            >
              Back to login
            </p>
          </>
        )}

        {mode === "reset" && (
          <>
            <h2>Reset Password</h2>

            {loadingMode === "verify" && (
              <p style={{ color: "#bbb" }}>Loading...</p>
            )}
            {loadingMode === "save" && (
              <p style={{ color: "#bbb" }}>Confirming new password...</p>
            )}

            {!loadingMode && verifyStatus && !verifyStatus.success && (
              <>
                <p style={{ color: "red", marginTop: 8 }}>
                  {verifyStatus.message || "Token invalid or expired."}
                </p>
                <p style={{ marginTop: 12 }}>
                  <button
                    className="auth-button"
                    onClick={() => {
                      setMode("request");
                      setVerifyStatus(null);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    style={{ width: "auto" }}
                  >
                    Request a new reset link
                  </button>
                </p>
              </>
            )}

            {!loadingMode && verifyStatus && verifyStatus.success && (
              <form onSubmit={handleReset}>
                <div className="input-group">
                  <label>New password</label>
                  <div className="input-field">
                    <FaLock className="icon" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      style={{ color: "white" }}
                    />
                    <button
                      type="button"
                      className="eye-button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirm password</label>
                  <div className="input-field">
                    <FaLock className="icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      style={{ color: "white" }}
                    />
                    <button
                      type="button"
                      className="eye-button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loadingMode === "save"}
                >
                  {loadingMode === "save" ? "Saving..." : "Save New Password"}
                </button>

                <p
                  className="toggle-text"
                  style={{ marginTop: 12, cursor: "pointer" }}
                  onClick={() => navigate("/login&signup")}
                >
                  Back to login
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
