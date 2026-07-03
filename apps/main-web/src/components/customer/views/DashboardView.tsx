type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone: string;
  status: string;
};

type Booking = {
  id: string;
  vehicleNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  serviceType: string;
  bookingDate: string;
  status: string;
  serviceCenter?: ServiceCenter;
  jobCard?: {
    id: string;
    status: string;
  };
};

type CustomerJobCard = {
  id: string;
  vehicleNumber: string;
  serviceType: string;
  status: string;
  booking?: {
    vehicleBrand?: string;
    vehicleModel?: string;
    serviceCenter?: ServiceCenter;
  };
};

type Props = {
  customerName: string;
  customerPhone: string;
  bookings: Booking[];
  vehiclesCount: number;
  currentJobCard: CustomerJobCard | null;
  loadingJobCard: boolean;
  onOpenSection: (
    section:
      | "garage"
      | "book-service"
      | "bookings"
      | "job-card"
      | "photos"
      | "invoices"
      | "payments"
      | "profile",
  ) => void;
};

export default function DashboardView({
  customerName,
  customerPhone,
  bookings,
  vehiclesCount,
  currentJobCard,
  loadingJobCard,
  onOpenSection,
}: Props) {
  const latestBooking = bookings[0];

  return (
    <>
      <section className="customer-hero">
        <p className="customer-gold-text">VICTORY CUSTOMER DASHBOARD</p>
        <h1 style={{ margin: 0, fontSize: 34 }}>Welcome, {customerName}</h1>
        <p style={{ margin: "10px 0 0", color: "#ddd" }}>
          Mobile Number: <b>{customerPhone || "-"}</b>
        </p>
      </section>

      <section className="customer-stats-grid">
        <InfoCard title="Total Bookings" value={bookings.length.toString()} />
        <InfoCard title="Garage Vehicles" value={vehiclesCount.toString()} />
        <InfoCard title="Active Status" value={latestBooking?.status || "-"} />
        <InfoCard
          title="Job Card"
          value={latestBooking?.jobCard?.status || "Not Created"}
        />
      </section>

      <section className="customer-dashboard-two-grid">
        <div className="customer-card">
          <div className="customer-section-head">
            <h2>Recent Booking</h2>
            <button onClick={() => onOpenSection("bookings")}>
              View All Bookings
            </button>
          </div>

          {latestBooking ? (
            <div className="customer-details-grid">
              <Detail label="Vehicle" value={latestBooking.vehicleNumber} />
              <Detail
                label="Model"
                value={`${latestBooking.vehicleBrand || "-"} ${
                  latestBooking.vehicleModel || ""
                }`}
              />
              <Detail label="Service" value={latestBooking.serviceType} />
              <Detail label="Status" value={latestBooking.status} />
              <Detail
                label="Center"
                value={latestBooking.serviceCenter?.name || "-"}
              />
              <Detail
                label="Date"
                value={new Date(latestBooking.bookingDate).toLocaleDateString()}
              />
            </div>
          ) : (
            <p style={{ color: "#777" }}>No recent booking found.</p>
          )}
        </div>

        <div className="customer-card">
          <div className="customer-section-head">
            <h2>Current Job Card</h2>
            <button onClick={() => onOpenSection("job-card")}>
              View Job Card
            </button>
          </div>

          {loadingJobCard ? (
            <p style={{ color: "#777" }}>Loading job card...</p>
          ) : currentJobCard ? (
            <div className="customer-details-grid">
              <Detail
                label="Job Card ID"
                value={currentJobCard.id.slice(0, 8).toUpperCase()}
              />
              <Detail label="Status" value={currentJobCard.status} />
              <Detail
                label="Vehicle"
                value={`${currentJobCard.booking?.vehicleBrand || "-"} ${
                  currentJobCard.booking?.vehicleModel || ""
                } - ${currentJobCard.vehicleNumber}`}
              />
              <Detail label="Service" value={currentJobCard.serviceType} />
            </div>
          ) : (
            <p style={{ color: "#777" }}>No active job card found.</p>
          )}
        </div>
      </section>

      <section className="customer-card">
        <h2 style={{ marginTop: 0 }}>Quick Access</h2>
        <div className="customer-quick-grid">
          <Quick title="My Garage" onClick={() => onOpenSection("garage")} />
          <Quick
            title="Book Service"
            onClick={() => onOpenSection("book-service")}
          />
          <Quick
            title="My Bookings"
            onClick={() => onOpenSection("bookings")}
          />
          <Quick title="Job Card" onClick={() => onOpenSection("job-card")} />
          <Quick
            title="Photos & Videos"
            onClick={() => onOpenSection("photos")}
          />
          <Quick title="Invoices" onClick={() => onOpenSection("invoices")} />
          <Quick title="Payments" onClick={() => onOpenSection("payments")} />
          <Quick title="Profile" onClick={() => onOpenSection("profile")} />
        </div>
      </section>
    </>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="customer-info-card">
      <p style={{ margin: 0, color: "#777", fontWeight: 700 }}>{title}</p>
      <h2 style={{ margin: "10px 0 0", color: "#111" }}>{value}</h2>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ margin: "0 0 6px", color: "#777", fontSize: 14 }}>{label}</p>
      <b>{value}</b>
    </div>
  );
}

function Quick({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      className="customer-quick-card customer-quick-button"
      onClick={onClick}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: "#777", marginBottom: 0 }}>Open section</p>
    </button>
  );
}
