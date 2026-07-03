import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 160px)",
        background: "#f3f3f3",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "1px solid #ffb3b3",
              borderRadius: "30px",
              color: "#ff0000",
              fontWeight: 700,
              fontSize: "14px",
              background: "#fff0f0",
              marginBottom: "20px",
            }}
          >
            LOGIN PORTAL
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#111111",
              margin: "0 0 20px 0",
              lineHeight: 1.1,
            }}
          >
            Choose Your Login Type
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#666666",
              maxWidth: "760px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Customers can sign in quickly using mobile OTP, while service center
            partners can access their dashboard using email and password.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {/* Customer Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #ececec",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "18px",
                background: "#f7e9ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "28px",
                fontSize: "28px",
              }}
            >
              👤
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#111111",
                marginBottom: "18px",
              }}
            >
              Customer Login
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: "#666666",
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
            >
              Fast and easy login for vehicle owners using mobile number and OTP
              verification.
            </p>

            <ul
              style={{
                paddingLeft: "20px",
                color: "#444444",
                lineHeight: 2,
                fontSize: "15px",
                marginBottom: "30px",
              }}
            >
              <li>Quick OTP access</li>
              <li>Easy for all users</li>
              <li>Best for customer bookings</li>
            </ul>

            <button
              onClick={() => navigate("/customer-login")}
              style={{
                background: "#ff0000",
                border: "none",
                color: "#ffffff",
                height: "50px",
                borderRadius: "12px",
                fontWeight: 700,
                padding: "0 28px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Continue as Customer
            </button>
          </div>

          {/* Service Center Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #ececec",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "18px",
                background: "#f5edcf",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "28px",
                fontSize: "28px",
              }}
            >
              🏢
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#111111",
                marginBottom: "18px",
              }}
            >
              Service Center Login
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: "#666666",
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
            >
              Secure partner access for service centers using registered email
              address and password.
            </p>

            <ul
              style={{
                paddingLeft: "20px",
                color: "#444444",
                lineHeight: 2,
                fontSize: "15px",
                marginBottom: "30px",
              }}
            >
              <li>Professional partner access</li>
              <li>Secure email login</li>
              <li>Best for branch operations</li>
            </ul>

            <button
              onClick={() => navigate("/service-center-login")}
              style={{
                background: "#d4af37",
                border: "none",
                color: "#111111",
                height: "50px",
                borderRadius: "12px",
                fontWeight: 700,
                padding: "0 28px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Continue as Service Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
