import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("serviceCenterUser");
  const serviceCenterUser = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("serviceCenterToken");
    localStorage.removeItem("serviceCenterUser");
    alert("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <header
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #eaeaea",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/logo.png"
            alt="Victory On Wheels"
            style={{
              height: "52px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <Link to="/about" style={navLinkStyle}>
            About
          </Link>
          <Link to="/customer" style={navLinkStyle}>
            Customer
          </Link>
          <Link to="/service-center" style={navLinkStyle}>
            Service Center
          </Link>
          <Link to="/insurance" style={navLinkStyle}>
            Insurance
          </Link>
          <Link to="/contact" style={navLinkStyle}>
            Contact
          </Link>
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {serviceCenterUser ? (
            <>
              <div
                style={{
                  background: "#fff7e6",
                  color: "#111",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  border: "1px solid #f0d58a",
                }}
              >
                {serviceCenterUser.name}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "#ff0000",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#ff0000",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#222",
  fontWeight: 600,
  fontSize: "15px",
};
