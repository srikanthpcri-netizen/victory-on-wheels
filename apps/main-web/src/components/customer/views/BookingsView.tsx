type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  address?: string;
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
    status: string;
  };
};

type Props = {
  bookings: Booking[];
};

export default function BookingsView({ bookings }: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p style={{ color: "#777" }}>No bookings found.</p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="customer-booking-card">
              <div>
                <h3 style={{ margin: "0 0 8px" }}>{booking.vehicleNumber}</h3>

                <p style={{ margin: 0, color: "#666" }}>
                  {booking.vehicleBrand || "-"} {booking.vehicleModel || ""} •{" "}
                  {booking.serviceType}
                </p>

                <p style={{ margin: "8px 0 0", color: "#666" }}>
                  {booking.serviceCenter?.name || "-"}
                </p>

                <p style={{ margin: "8px 0 0", color: "#666" }}>
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span className="customer-status">{booking.status}</span>

                <p style={{ marginTop: 10 }}>
                  <b>{booking.jobCard?.status || "Not Created"}</b>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
