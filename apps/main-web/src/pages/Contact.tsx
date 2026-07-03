import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span>Contact Victory On Wheels</span>
          <h1>We’re here to help with your vehicle service needs.</h1>
          <p>
            Reach out for service bookings, insurance enquiries, customer
            support, service center support or partnership discussions.
          </p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-info-card">
          <span>Phone</span>
          <h3>+91 98765 43210</h3>
          <p>Customer and service support</p>
        </div>

        <div className="contact-info-card">
          <span>Email</span>
          <h3>support@victoryonwheels.com</h3>
          <p>General enquiries and support</p>
        </div>

        <div className="contact-info-card">
          <span>Location</span>
          <h3>Hyderabad, Telangana</h3>
          <p>Service network expansion in progress</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-form-card">
          <span className="contact-label">Send Message</span>
          <h2>Tell us how we can help</h2>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-grid">
              <FormField label="Full Name *">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Mobile Number *">
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter mobile number"
                />
              </FormField>

              <FormField label="Email">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </FormField>

              <FormField label="Subject *">
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Service enquiry"
                />
              </FormField>
            </div>

            <FormField label="Message *">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message..."
              />
            </FormField>

            {submitted && (
              <div className="contact-success">
                Message submitted successfully. Our team will contact you soon.
              </div>
            )}

            <button type="submit">Submit Message</button>
          </form>
        </div>

        <div className="contact-side-card">
          <span className="contact-label">Support Details</span>
          <h2>Business Hours</h2>

          <div className="contact-hours">
            <div>
              <span>Monday - Saturday</span>
              <b>09:00 AM - 07:00 PM</b>
            </div>
            <div>
              <span>Sunday</span>
              <b>Emergency Support Only</b>
            </div>
          </div>

          <div className="contact-service-box">
            <h3>Service Coverage</h3>
            <p>
              We currently support customer bookings, service center operations,
              job cards, media updates, invoices and insurance enquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div>
          <span className="contact-label">Find Us</span>
          <h2>Victory On Wheels Service Network</h2>
          <p>
            Map integration can be connected here later when final business
            address and service zones are confirmed.
          </p>
        </div>

        <div className="contact-map-placeholder">Hyderabad Service Network</div>
      </section>

      <section className="contact-cta">
        <h2>Need vehicle service today?</h2>
        <p>
          Login as a customer and book your service from the customer dashboard.
        </p>
        <a href="/customer-login">Book Service</a>
      </section>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="contact-field">
      <label>{label}</label>
      {children}
    </div>
  );
}
