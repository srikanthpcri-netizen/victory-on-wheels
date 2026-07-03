import "./About.css";

const services = [
  "Car Service",
  "Bike Service",
  "EV Service",
  "Insurance Support",
  "Job Cards",
  "Invoices",
];

const processSteps = [
  "Book Service",
  "Assign Service Center",
  "Track Job Card",
  "Receive Invoice",
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span>Victory On Wheels</span>
          <h1>Reliable Vehicle Service, Simplified.</h1>
          <p>
            Victory On Wheels connects customers with trusted service centers
            for vehicle service, repairs, insurance support, job cards, photos,
            videos and invoices in one clean digital platform.
          </p>
        </div>
      </section>

      <section className="about-section about-intro">
        <div>
          <span className="about-label">Who We Are</span>
          <h2>Your vehicle care partner</h2>
        </div>
        <p>
          We are building a modern automobile service ecosystem where customers
          can book service, track updates, view job cards, receive service media
          and access invoices without confusion or delays.
        </p>
      </section>

      <section className="about-mission-grid">
        <div className="about-info-card">
          <h3>Our Mission</h3>
          <p>
            To make vehicle service transparent, accessible and convenient for
            every customer.
          </p>
        </div>

        <div className="about-info-card">
          <h3>Our Vision</h3>
          <p>
            To become a trusted digital service network for cars, bikes, EVs and
            commercial vehicles.
          </p>
        </div>
      </section>

      <section className="about-section">
        <span className="about-label">What We Offer</span>
        <h2>Complete vehicle service platform</h2>

        <div className="about-services-grid">
          {services.map((service) => (
            <div className="about-service-card" key={service}>
              <div className="about-service-icon">✓</div>
              <h3>{service}</h3>
              <p>
                Premium digital support designed to keep customers updated and
                service centers organized.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-process">
        <span className="about-label">How It Works</span>
        <h2>Simple 4-step service journey</h2>

        <div className="about-process-grid">
          {processSteps.map((step, index) => (
            <div className="about-process-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="about-stats">
        <div>
          <h3>Multi-Vehicle</h3>
          <p>Cars, Bikes, EVs and Commercial Vehicles</p>
        </div>
        <div>
          <h3>Digital Updates</h3>
          <p>Job cards, photos, videos and invoices</p>
        </div>
        <div>
          <h3>Trusted Centers</h3>
          <p>Organized service center network</p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to book your vehicle service?</h2>
        <p>
          Login as a customer and manage your garage, bookings, job cards,
          service media and invoices from one dashboard.
        </p>
        <a href="/customer-login">Customer Login</a>
      </section>
    </div>
  );
}
