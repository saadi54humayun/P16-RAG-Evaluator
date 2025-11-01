import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/AccountSettings.css";

export default function AccountSettings() {
  const [activeSection, setActiveSection] = useState<string>("reset-password");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/");
  };

  // --- Delete Account ---
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiBase}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        setShowDeleteModal(false);
        navigate("/");
      } else {
        alert(data.detail || "Failed to delete account.");
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while deleting account.");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // --- Reset Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return;
    }

    try {
      // This would need a new endpoint to change password while logged in
      // For now, we'll show a message to use the forgot password flow
      setMessage("Please use the 'Forgot Password' link on the login page to reset your password.");
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="account-settings-container">
      {/* Header with Logout Button */}
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <button onClick={handleLogout} className="header-logout-button">
          Log Out
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Delete
              </button>
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-wrapper">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <h2>Account Settings</h2>
          <nav>
            <button
              className={activeSection === "reset-password" ? "active" : ""}
              onClick={() => setActiveSection("reset-password")}
            >
              Reset Password
            </button>
            <button
              className={activeSection === "delete-account" ? "active" : ""}
              onClick={() => setActiveSection("delete-account")}
            >
              Delete Account
            </button>
            </nav>
          <button className="back-button" onClick={() => navigate("/home")}>
            ← Back to Home
          </button>
        </aside>

        {/* Main Content */}
        <main className="settings-content">
          {activeSection === "reset-password" && (
            <div className="settings-section">
              <h1>Reset Password</h1>
              <p className="section-description">
                Change your account password. Make sure your new password is strong and secure.
              </p>
              <form onSubmit={handleResetPassword} className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" className="submit-button">
                  Update Password
                </button>
                {message && (
                  <p className={message.includes("success") ? "success-message" : "error-message"}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          )}

          {activeSection === "delete-account" && (
            <div className="settings-section">
              <h1>Delete Account</h1>
              <p className="section-description">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <div className="danger-zone">
                <div className="danger-info">
                  <h3>Warning:</h3>
                  <p>
                    Deleting your account will:
                  </p>
                  <ul>
                    <li>Permanently remove all your data</li>
                    <li>Remove your access to all services</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
                <button onClick={handleDeleteAccount} className="danger-button">
                  Delete My Account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
