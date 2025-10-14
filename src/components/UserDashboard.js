import { useState, useEffect } from "react";
import "./UserDashboard.css";
import avatarImg from "../assets/logo.png";
import { makeRegistrationRequestCall } from "../api/api";

const UserDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [storeCredit, setStoreCredit] = useState("0.00");
  const [salesData, setSalesData] = useState({});

  useEffect(() => {
    setName(sessionStorage.getItem("name") || "");
    setEmail(sessionStorage.getItem("email") || "");
    setPassword(sessionStorage.getItem("password") || "");
    const googleToken = sessionStorage.getItem("googleToken");
    const username = sessionStorage.getItem("username");

    fetchUserInfo(username, googleToken);
  }, []);

  async function fetchUserInfo(username, googleToken) {
    try {
      const data = await makeRegistrationRequestCall(
        "auth_script",
        "getUserInfo",
        { username, googleToken }
      );
      setStoreCredit(
        data.Value != null ? parseFloat(data.Value).toFixed(2) : "0.00"
      );
    } catch (e) {}
  }
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  async function handleConfirm() {
    const googleToken = sessionStorage.getItem("googleToken");
    const username = sessionStorage.getItem("username");
    const newEmail = email;
    const newName = name;

    try {
      const response = await makeRegistrationRequestCall(
        "auth_script",
        "updateProfile",
        {
          username,
          googleToken,
          newName,
          newEmail,
          password,
        }
      );

      if (response.success) {
        setUpdateStatus({
          success: true,
          message: "Profile updated successfully!",
        });
        setTimeout(() => {
          setShowPopup(false);
          setIsEditing(false);
          setUpdateStatus(null);
        }, 2000);
      } else {
        setUpdateStatus({
          success: false,
          message:
            "Failed to update profile. Please check your password and try again.",
        });
      }
    } catch (e) {}
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <button className="sign-out">Sign Out</button>
      </div>

      {/* User Details */}
      <div className="user-details">
        <img src={avatarImg} alt="User Avatar" className="user-avatar" />
        <div className="user-info">
          <h3>{name}</h3>
          <p>{email}</p>
          <p>
            <strong>Store Credit: </strong>${storeCredit}{" "}
          </p>
        </div>
        <button className="editprofilebutton" onClick={handleEditClick}>
          {isEditing ? "Close" : "Edit Profile"}
        </button>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="edit-profile-form">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="edit-buttons">
            <button className="edit-buttons-save" onClick={handleSave}>
              Save Changes
            </button>

            <button className="edit-buttons-cancel" onClick={handleCancel}>
              Cancel
            </button>
            {showPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <button
                    className="close-popup-button"
                    onClick={() => setShowPopup(false)}
                  >
                    ×
                  </button>
                  <h2>Verify Password</h2>
                  <p>Please enter your password to confirm changes:</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    className="confrim-password-btn"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  {updateStatus && (
                    <p
                      className={
                        updateStatus.success ? "success-text" : "error-text"
                      }
                    >
                      {updateStatus.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Details */}
      <div className="dashboard-section">
        <h3>Subscription Details</h3>
      </div>

      {/* This Month's Sales */}
      <div className="dashboard-section">
        <h3>This Month's Sales</h3>
        {Object.keys(salesData).length === 0 ? (
          <p>No sales data for this month.</p>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount (€)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(salesData).map(([date, amount]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td> € {Number(amount).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    €{" "}
                    {Object.values(salesData)
                      .reduce((sum, amt) => sum + Number(amt), 0)
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Discount Code */}
      <div className="dashboard-section">
        <h3>Generate Discount Code</h3>
        <input
          className="enter-amount-field"
          type="number"
          placeholder="Enter Amount"
        />
        <button className="generate-amount-btn">Generate Discount Code</button>
      </div>

      {/* Your Discount Codes */}
      <div className="dashboard-section">
        <h3>Your Discount Codes</h3>
        <p className="note">
          Note: Once a discount code is generated, it becomes a Shopify coupon
          and cannot be transferred back to in-store credit without contacting
          the IT admin.
        </p>
        <p>You currently have no active discount codes.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
