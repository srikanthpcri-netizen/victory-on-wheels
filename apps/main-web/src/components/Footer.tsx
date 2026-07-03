import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#000000",
        color: "#ffffff",
        padding: "50px 20px 24px",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          <div>
            <img
              src="/logo.png"
              alt="Victory On Wheels"
              style={{
                height: "54px",
                width: "auto",
                objectFit: "contain",
                marginBottom: "16px",
                display: "block",
              }}
            />

            <p
              style={{
                color: "#cccccc",
                lineHeight: 1.8,
                fontSize: "15px",
                margin: 0,
              }}
            >
              Victory On Wheels is your trusted automobile service platform for
              customers, service centers, and insurance support.
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "18px",
              }}
            >
              Quick Links
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Link to="/" style={footerLinkStyle}>
                Home
              </Link>
              <Link to="/about" style={footerLinkStyle}>
                About
              </Link>
              <Link to="/customer" style={footerLinkStyle}>
                Customer
              </Link>
              <Link to="/service-center" style={footerLinkStyle}>
                Service Center
              </Link>
              <Link to="/insurance" style={footerLinkStyle}>
                Insurance
              </Link>
              <Link to="/contact" style={footerLinkStyle}>
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "18px",
              }}
            >
              Services
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                color: "#cccccc",
                fontSize: "15px",
              }}
            >
              <span>Vehicle Service Booking</span>
              <span>Service Center Network</span>
              <span>Insurance Assistance</span>
              <span>Job Card Tracking</span>
              <span>Invoice Support</span>
            </div>
          </div>

          <div>
            <h3
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "18px",
              }}
            >
              Contact
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                color: "#cccccc",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              <span>Hyderabad, India</span>
              <span>support@victoryonwheels.com</span>
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "20px",
            textAlign: "center",
            color: "#aaaaaa",
            fontSize: "14px",
          }}
        >
          © 2026 Victory On Wheels. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: "#cccccc",
  textDecoration: "none",
  fontSize: "15px",
};
