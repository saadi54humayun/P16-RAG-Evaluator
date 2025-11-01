import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styling/Login.css";
import "../styling/ResetPassword.css";

interface APIResponse {
  message?: string;
  detail?: string;
  reset_token?: string;
}

// Request Password Reset Component
export function RequestResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const response = await fetch(`${apiBase}/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: APIResponse = await response.json();
      
      if (response.ok) {
        setMessage("OTP has been sent to your email!");
        setOtpSent(true);
      } else {
        setMessage(data.detail ?? "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const response = await fetch(`${apiBase}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data: APIResponse = await response.json();
      
      if (response.ok && data.reset_token) {
        setMessage("OTP verified! Redirecting to reset password...");
        // Navigate to reset password page with token
        setTimeout(() => {
          navigate(`/reset-password?token=${data.reset_token}`);
        }, 1500);
      } else {
        setMessage(data.detail ?? "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Reset Password</h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          {!otpSent 
            ? "Please enter the email address that you used to register, and we will send you an OTP via Email."
            : "Enter the 6-digit OTP sent to your email."}
        </p>
        
        {!otpSent ? (
          <form onSubmit={handleRequestOtp}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              placeholder="Enter 6-digit OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]{6}"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        
        {message && (
          <p
            className={
              message.includes("Failed") || 
              message.includes("error") || 
              message.includes("Invalid")
                ? "error"
                : "success"
            }
          >
            {message}
          </p>
        )}
        <div className="reset-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

// Reset Password with Token Component
export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return;
    }

    if (!token) {
      setMessage("Invalid or missing reset token!");
      return;
    }

    setLoading(true);

    try {
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const response = await fetch(`${apiBase}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data: APIResponse = await response.json();
      
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.detail ?? "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Set New Password</h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          Enter your new password below. Password must be at least 6 characters long.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            placeholder="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p
            className={
              message.includes("Failed") ||
              message.includes("error") ||
              message.includes("not match") ||
              message.includes("Invalid") ||
              message.includes("must be")
                ? "error"
                : "success"
            }
          >
            {message}
          </p>
        )}
        <div className="reset-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

// Default export for backwards compatibility
export default RequestResetPassword;