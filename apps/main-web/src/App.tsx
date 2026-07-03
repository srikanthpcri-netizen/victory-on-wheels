import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedServiceCenterRoute from "./components/ProtectedServiceCenterRoute";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Insurance from "./pages/Insurance";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import ServiceCenter from "./pages/ServiceCenter";
import ServiceCenterLoginPage from "./pages/ServiceCenterLoginPage";
import ServiceCenterDashboard from "./pages/ServiceCenterDashboard";
import ServiceCenterJobCard from "./pages/ServiceCenterJobCard";
import ServiceCenterSparePartsRequest from "./pages/ServiceCenterSparePartsRequest";
import ServiceCenterProfileSettings from "./pages/ServiceCenterProfileSettings";
import CustomerLoginPage from "./pages/CustomerLoginPage";

function AppLayout() {
  const location = useLocation();

  const isServiceCenterArea =
    location.pathname === "/service-center-dashboard" ||
    location.pathname.startsWith("/service-center-dashboard/");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {!isServiceCenterArea ? <Header /> : null}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/service-center" element={<ServiceCenter />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />

          <Route
            path="/customer"
            element={
              <ProtectedCustomerRoute>
                <Customer />
              </ProtectedCustomerRoute>
            }
          />

          <Route
            path="/service-center-login"
            element={<ServiceCenterLoginPage />}
          />

          <Route
            path="/service-center-dashboard"
            element={
              <ProtectedServiceCenterRoute>
                <ServiceCenterDashboard />
              </ProtectedServiceCenterRoute>
            }
          >
            <Route path="dashboard" element={null} />
            <Route
              path="spare-parts-request"
              element={<ServiceCenterSparePartsRequest />}
            />
            <Route
              path="job-card/:bookingId"
              element={<ServiceCenterJobCard />}
            />
            <Route
              path="profile-settings"
              element={<ServiceCenterProfileSettings />}
            />
          </Route>
        </Routes>
      </main>

      {!isServiceCenterArea ? <Footer /> : null}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
