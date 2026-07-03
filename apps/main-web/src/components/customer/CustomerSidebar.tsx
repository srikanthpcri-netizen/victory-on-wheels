import { Link, useNavigate } from "react-router-dom";
import "./CustomerSidebar.css";

export type CustomerSection =
  | "dashboard"
  | "garage"
  | "book-service"
  | "bookings"
  | "job-card"
  | "photos"
  | "invoices"
  | "payments"
  | "profile";

type Props = {
  activeSection: CustomerSection;
  onSectionChange: (section: CustomerSection) => void;
};

export default function CustomerSidebar({
  activeSection,
  onSectionChange,
}: Props) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("customerName");
    navigate("/customer-login");
  };

  const menu: { title: string; key: CustomerSection }[] = [
    { title: "Dashboard", key: "dashboard" },
    { title: "My Garage", key: "garage" },
    { title: "Book Service", key: "book-service" },
    { title: "My Bookings", key: "bookings" },
    { title: "Current Job Card", key: "job-card" },
    { title: "Photos & Videos", key: "photos" },
    { title: "Invoices", key: "invoices" },
    { title: "Payments", key: "payments" },
    { title: "Profile", key: "profile" },
  ];

  return (
    <aside className="customer-sidebar">
      <h2 className="customer-sidebar-logo">Victory On Wheels</h2>

      <div className="customer-sidebar-menu">
        {menu.map((item) => (
          <button
            key={item.key}
            className={
              activeSection === item.key
                ? "customer-sidebar-link active"
                : "customer-sidebar-link"
            }
            onClick={() => onSectionChange(item.key)}
          >
            {item.title}
          </button>
        ))}

        <Link className="customer-sidebar-link" to="/insurance">
          Insurance
        </Link>
      </div>

      <button className="customer-sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
