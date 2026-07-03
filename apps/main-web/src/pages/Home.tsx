import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ width: "100%", overflowX: "hidden", background: "#ffffff" }}>
      {/* Hero Section */}
      <section
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* YouTube Video Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/PUkAIAIzA0I?autoplay=1&mute=1&controls=0&loop=1&playlist=PUkAIAIzA0I&modestbranding=1&rel=0&playsinline=1&enablejsapi=1"
            title="Victory On Wheels Hero Video"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "177.78vh",
              height: "100vh",
              minWidth: "100vw",
              minHeight: "56.25vw",
              transform: "translate(-50%, -50%) scale(1.2)",
              border: "none",
            }}
          />
        </div>

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.58) 50%, rgba(0,0,0,0.72) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1200,
            textAlign: "center",
            color: "#ffffff",
            padding: "120px 24px 80px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(212, 175, 55, 0.12)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              color: "#D4AF37",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.4,
              marginBottom: 22,
            }}
          >
            VEHICLE SERVICE • INSURANCE • SERVICE CENTER NETWORK
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(38px, 6vw, 72px)",
              lineHeight: 1.08,
              fontWeight: 700,
              maxWidth: 980,
              marginInline: "auto",
            }}
          >
            Your Trusted Vehicle
            <span style={{ color: "#D4AF37" }}> Service </span>
            Partner
          </h1>

          <p
            style={{
              marginTop: 22,
              marginBottom: 0,
              fontSize: 18,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 860,
              marginInline: "auto",
            }}
          >
            Victory On Wheels connects customers, service centers, and insurance
            support in one seamless platform for faster service requests,
            smoother operations, and better customer experience.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 34,
            }}
          >
            <Link
              to="/customer"
              style={{
                textDecoration: "none",
                background: "#ff0000",
                color: "#ffffff",
                padding: "15px 28px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 10px 24px rgba(255,0,0,0.22)",
              }}
            >
              Explore Customer Services
            </Link>

            <Link
              to="/insurance"
              style={{
                textDecoration: "none",
                background: "#D4AF37",
                color: "#111111",
                padding: "15px 28px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(212,175,55,0.22)",
              }}
            >
              Get Insurance Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section
        style={{
          width: "100%",
          padding: "80px 24px",
          background: "#f8f8f8",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(30px, 4vw, 46px)",
                color: "#111111",
                fontWeight: 700,
              }}
            >
              Our Core Services
            </h2>

            <p
              style={{
                marginTop: 14,
                color: "#666666",
                fontSize: 17,
                maxWidth: 760,
                marginInline: "auto",
                lineHeight: 1.8,
              }}
            >
              Designed for customers who need reliable vehicle support and
              service centers looking for a stronger digital presence.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 28,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(255,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 18,
                }}
              >
                🚗
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 26,
                  color: "#111111",
                }}
              >
                Vehicle Service Booking
              </h3>
              <p
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  color: "#666666",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                Customers can raise service requests easily, connect with nearby
                service centers, and track the service journey with clarity.
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 28,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(212,175,55,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 18,
                }}
              >
                🛠️
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 26,
                  color: "#111111",
                }}
              >
                Service Center Network
              </h3>
              <p
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  color: "#666666",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                Partner service centers can manage bookings, improve visibility,
                and streamline customer operations through one connected system.
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 28,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 18,
                }}
              >
                🛡️
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 26,
                  color: "#111111",
                }}
              >
                Insurance Assistance
              </h3>
              <p
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  color: "#666666",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                Users can submit insurance enquiries quickly and receive guided
                assistance for vehicle-related policy requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
