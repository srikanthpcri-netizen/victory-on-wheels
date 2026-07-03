export default function PaymentsView() {
  return (
    <section className="customer-card">
      <div className="customer-section-head">
        <div>
          <p className="customer-gold-text">PAYMENTS</p>
          <h2>My Payments</h2>
        </div>
      </div>

      <div className="customer-details-grid">
        <div className="customer-info-card">
          <h3>Total Paid</h3>
          <p>₹0.00</p>
        </div>

        <div className="customer-info-card">
          <h3>Pending Due</h3>
          <p>₹0.00</p>
        </div>

        <div className="customer-info-card">
          <h3>Payment Status</h3>
          <p>No payments found yet.</p>
        </div>
      </div>
    </section>
  );
}
