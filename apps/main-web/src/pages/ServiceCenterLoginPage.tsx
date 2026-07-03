import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setServiceCenterAuth } from "../utils/serviceCenterAuth";

type LoginResponse = {
  message: string;
  access_token: string;
  serviceCenter: {
    id: string;
    name: string;
    city: string;
    phone: string;
  };
};

export default function ServiceCenterLoginPage() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const cleanedPhone = phone.trim();

    if (!cleanedPhone) {
      setErrorMessage("Please enter phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/auth/service-center-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: cleanedPhone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data?.message)) {
          setErrorMessage(data.message[0]);
        } else {
          setErrorMessage(data?.message || "Login failed. Please try again.");
        }
        return;
      }

      const loginData = data as LoginResponse;

      setServiceCenterAuth(loginData.access_token, loginData.serviceCenter);

      localStorage.setItem(
        "serviceCenter",
        JSON.stringify(loginData.serviceCenter),
      );
      localStorage.setItem("serviceCenterPhone", loginData.serviceCenter.phone);

      navigate("/service-center-dashboard");
    } catch (error) {
      console.error("Service center login failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff7e6 0%, #ffffff 45%, #fff1f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "36px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
          border: "1px solid #f3f4f6",
        }}
      >
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              lineHeight: 1.2,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Service Center Login
          </h1>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              fontSize: "15px",
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Login with your registered service center phone number.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                padding: "0 14px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {errorMessage ? (
            <div
              style={{
                marginBottom: "16px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: loading ? "#fca5a5" : "#ff0000",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s ease",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
