import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./ServiceCenterDashboard.css";

type Booking = {
  id: string;
  customerName?: string;
  customerPhone?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  serviceType?: string;
  bookingDate?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type StoredServiceCenter = {
  id?: string;
  name?: string;
  city?: string;
  phone?: string;
};

export default function ServiceCenterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const storedServiceCenterRaw = localStorage.getItem("serviceCenter");
  let storedServiceCenter: StoredServiceCenter | null = null;

  try {
    storedServiceCenter = storedServiceCenterRaw
      ? JSON.parse(storedServiceCenterRaw)
      : null;
  } catch {
    storedServiceCenter = null;
  }

  const serviceCenterName =
    storedServiceCenter?.name ||
    localStorage.getItem("serviceCenterName") ||
    "Victory Kukatpally Service Center";

  const serviceCenterPhone =
    storedServiceCenter?.phone ||
    localStorage.getItem("serviceCenterPhone") ||
    "9876543210";

  const pathname = location.pathname;

  const isSparePartsPage = pathname.includes("/spare-parts-request");
  const isJobCardPage = pathname.includes("/job-card/");
  const isInvoicesPage = pathname.includes("/invoices");
  const isProfileSettingsPage = pathname.includes("/profile-settings");
  const isDashboardPage = pathname === "/service-center-dashboard/dashboard";
  const isBookingsPage =
    pathname === "/service-center-dashboard" ||
    pathname === "/service-center-dashboard/bookings";

  useEffect(() => {
    if (!isBookingsPage && !isDashboardPage) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("serviceCenterToken") ||
          localStorage.getItem("serviceCenterAccessToken");

        const response = await fetch("https://victory-on-wheels-production.up.railway.app/booking", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isBookingsPage, isDashboardPage]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        (booking.customerName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (booking.customerPhone || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (booking.vehicleNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (booking.serviceType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (booking.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "pending",
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "confirmed",
  ).length;
  const completedBookings = bookings.filter(
    (b) => (b.status || "").toLowerCase() === "completed",
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("serviceCenterToken");
    localStorage.removeItem("serviceCenterAccessToken");
    localStorage.removeItem("serviceCenterName");
    localStorage.removeItem("serviceCenterEmail");
    localStorage.removeItem("serviceCenterPhone");
    localStorage.removeItem("serviceCenter");
    navigate("/service-center-login");
  };

  return (
    <div className="sc-dashboard-layout">
      <aside className="sc-sidebar">
        <div>
          <div className="sc-brand">
            <h1>Victory On Wheels</h1>
            <p>Service Center Portal</p>
          </div>

          <div className="sc-profile-card">
            <span className="sc-profile-label">LOGGED IN AS</span>
            <h3>{serviceCenterName}</h3>
            <p>{serviceCenterPhone}</p>
          </div>

          <nav className="sc-nav">
            <button
              className={`sc-nav-btn ${isDashboardPage ? "active" : ""}`}
              onClick={() => navigate("/service-center-dashboard/dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`sc-nav-btn ${isBookingsPage ? "active" : ""}`}
              onClick={() => navigate("/service-center-dashboard")}
            >
              Bookings
            </button>

            <button
              className={`sc-nav-btn ${isJobCardPage ? "active" : ""}`}
              onClick={() => navigate("/service-center-dashboard")}
            >
              Job Cards
            </button>

            <button
              className={`sc-nav-btn ${isSparePartsPage ? "active" : ""}`}
              onClick={() =>
                navigate("/service-center-dashboard/spare-parts-request")
              }
            >
              Spare Parts
            </button>

            <button
              className={`sc-nav-btn ${
                pathname.includes("/profile-settings") ? "active" : ""
              }`}
              onClick={() =>
                navigate("/service-center-dashboard/profile-settings")
              }
            >
              Profile Settings
            </button>
          </nav>
        </div>

        <button className="sc-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="sc-main-content">
        {isSparePartsPage ||
        isJobCardPage ||
        isInvoicesPage ||
        isProfileSettingsPage ? (
          <Outlet />
        ) : isDashboardPage ? (
          <>
            <div className="sc-page-header">
              <h2>Dashboard Overview</h2>
              <p>Quick summary of current service center activity</p>
            </div>

            <div className="sc-stats-grid">
              <div className="sc-stat-card">
                <h3>{totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
              <div className="sc-stat-card">
                <h3>{pendingBookings}</h3>
                <p>Pending Bookings</p>
              </div>
              <div className="sc-stat-card">
                <h3>{confirmedBookings}</h3>
                <p>Confirmed Bookings</p>
              </div>
              <div className="sc-stat-card">
                <h3>{completedBookings}</h3>
                <p>Completed Bookings</p>
              </div>
            </div>

            <div className="sc-content-card">
              <h3>Welcome</h3>
              <p>
                Use the sidebar to manage bookings, job cards, spare parts,
                invoices, and profile settings.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="sc-page-header">
              <h2>Bookings</h2>
              <p>View and manage customer bookings</p>
            </div>

            <div className="sc-content-card">
              <div className="sc-toolbar">
                <input
                  type="text"
                  placeholder="Search by customer, phone, vehicle, service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sc-search-input"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="sc-filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {loading ? (
                <p className="sc-message">Loading bookings...</p>
              ) : error ? (
                <p className="sc-message error">{error}</p>
              ) : filteredBookings.length === 0 ? (
                <p className="sc-message">No bookings found.</p>
              ) : (
                <div className="sc-booking-list">
                  {filteredBookings.map((booking) => (
                    <div className="sc-booking-card" key={booking.id}>
                      <div className="sc-booking-top">
                        <div>
                          <h3>{booking.customerName || "Customer"}</h3>
                          <p>
                            {booking.vehicleNumber || "-"} •{" "}
                            {booking.serviceType || "-"}
                          </p>
                        </div>

                        <span
                          className={`sc-status-badge status-${(
                            booking.status || "pending"
                          ).toLowerCase()}`}
                        >
                          {booking.status || "PENDING"}
                        </span>
                      </div>

                      <div className="sc-booking-grid">
                        <div>
                          <label>Phone</label>
                          <p>{booking.customerPhone || "-"}</p>
                        </div>

                        <div>
                          <label>Vehicle Type</label>
                          <p>{booking.vehicleType || "-"}</p>
                        </div>

                        <div>
                          <label>Booking Date</label>
                          <p>
                            {booking.bookingDate
                              ? new Date(booking.bookingDate).toLocaleString()
                              : "-"}
                          </p>
                        </div>

                        <div>
                          <label>Notes</label>
                          <p>{booking.notes || "-"}</p>
                        </div>
                      </div>

                      <div className="sc-booking-actions">
                        <button
                          className="sc-primary-btn"
                          onClick={() =>
                            navigate(
                              `/service-center-dashboard/job-card/${booking.id}`,
                            )
                          }
                        >
                          View Job Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
