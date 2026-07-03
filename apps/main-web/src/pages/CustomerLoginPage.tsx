import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function CustomerLoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } catch (error) {
      console.warn("reCAPTCHA clear skipped:", error);
      window.recaptchaVerifier = undefined;
    }
  };

  useEffect(() => {
    clearRecaptcha();

    return () => {
      clearRecaptcha();
    };
  }, []);

  const setupRecaptcha = () => {
    clearRecaptcha();

    window.recaptchaVerifier = new RecaptchaVerifier(
      firebaseAuth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
      },
    );

    return window.recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const appVerifier = setupRecaptcha();
      const fullPhoneNumber = `+91${phone}`;

      const result = await signInWithPhoneNumber(
        firebaseAuth,
        fullPhoneNumber,
        appVerifier,
      );

      setConfirmationResult(result);
      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (error: any) {
      console.error("Firebase Error:", error);
      clearRecaptcha();
      alert(`${error.code || "Firebase Error"}\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      alert("Please send OTP first");
      return;
    }

    if (otp.length !== 6) {
      alert("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const firebaseUserCredential = await confirmationResult.confirm(otp);
      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

      const res = await fetch(
        "https://victory-on-wheels-production.up.railway.app/auth/firebase-customer-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseIdToken,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("customerToken", data.access_token);
      localStorage.setItem("customerPhone", data.customer.phone);
      localStorage.setItem("customerName", data.customer.name || "Customer");

      clearRecaptcha();

      alert("Customer login successful");
      navigate("/customer");
    } catch (error: any) {
      console.error("Customer login error:", error);

      alert(
        `${error?.code || "Login Error"}\n\n${
          error?.message || "Invalid OTP or login failed. Please try again."
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMobileNumber = () => {
    setOtp("");
    setOtpSent(false);
    setConfirmationResult(null);
    clearRecaptcha();
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f3f3",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            marginBottom: "20px",
            background: "none",
            border: "none",
            color: "#c90000",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: "10px" }}>Customer Login</h2>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Login using Firebase mobile OTP verification
        </p>

        <input
          type="text"
          placeholder="Enter mobile number"
          value={phone}
          disabled={otpSent || loading}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setPhone(val);
          }}
          style={{
            width: "100%",
            height: "45px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "0 12px",
            marginBottom: "14px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        {otpSent && (
          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(val);
            }}
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              padding: "0 12px",
              marginBottom: "14px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        )}

        <div id="recaptcha-container"></div>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              background: "#c90000",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              background: "#c90000",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify OTP & Login"}
          </button>
        )}

        {otpSent && (
          <button
            onClick={handleChangeMobileNumber}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "12px",
              height: "42px",
              borderRadius: "12px",
              background: "#fff",
              color: "#c90000",
              border: "1px solid #c90000",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Change Mobile Number
          </button>
        )}
      </div>
    </div>
  );
}
