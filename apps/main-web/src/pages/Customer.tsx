import { useEffect, useMemo, useState } from "react";
import type { BookServiceFormData } from "../components/customer/BookServiceForm";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import type { CustomerSection } from "../components/customer/CustomerSidebar";
import type { Vehicle } from "../components/customer/MyGarage";
import DashboardView from "../components/customer/views/DashboardView";
import GarageView from "../components/customer/views/GarageView";
import BookServiceView from "../components/customer/views/BookServiceView";
import BookingsView from "../components/customer/views/BookingsView";
import JobCardView from "../components/customer/views/JobCardView";
import PhotosVideosView from "../components/customer/views/PhotosVideosView";
import InvoiceView from "../components/customer/views/InvoiceView";
import ProfileView from "../components/customer/views/ProfileView";
import "./Customer.css";

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
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  manufacturingYear?: number;
  fuelType?: string;
  transmission?: string;
  odometer?: number;
  serviceType: string;
  bookingDate: string;
  preferredTimeSlot?: string;
  pickupRequired?: boolean;
  emergencyService?: boolean;
  status: string;
  notes?: string;
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
  problemNotes?: string | null;
  estimatedAmount?: number | null;
  finalAmount?: number | null;
  createdAt?: string;
  attachments?: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    category: string;
    notes?: string | null;
  }[];
  booking?: {
    vehicleBrand?: string;
    vehicleModel?: string;
    serviceCenter?: ServiceCenter;
  };
};

const initialForm: BookServiceFormData = {
  city: "",
  serviceCenterId: "",
  vehicleNumber: "",
  vehicleType: "Car",
  vehicleBrand: "",
  vehicleModel: "",
  manufacturingYear: "",
  fuelType: "",
  transmission: "",
  odometer: "",
  serviceType: "",
  bookingDate: "",
  preferredTimeSlot: "",
  pickupRequired: false,
  emergencyService: false,
  notes: "",
};

export default function Customer() {
  const customerName = localStorage.getItem("customerName") || "Customer";
  const customerPhone = localStorage.getItem("customerPhone") || "";

  const [activeSection, setActiveSection] =
    useState<CustomerSection>("dashboard");

  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentJobCard, setCurrentJobCard] = useState<CustomerJobCard | null>(
    null,
  );

  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingJobCard, setLoadingJobCard] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<BookServiceFormData>(initialForm);

  useEffect(() => {
    fetchServiceCenters();
    fetchBookings();
    fetchVehicles();
    fetchCurrentJobCard();
  }, []);

  const cities = useMemo(() => {
    return Array.from(new Set(serviceCenters.map((c) => c.city))).filter(
      Boolean,
    );
  }, [serviceCenters]);

  const filteredCenters = useMemo(() => {
    if (!form.city) return [];
    return serviceCenters.filter((center) => center.city === form.city);
  }, [form.city, serviceCenters]);

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED" ||
      booking.status === "DELIVERED" ||
      booking.jobCard?.status === "COMPLETED",
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status !== "COMPLETED" &&
      booking.status !== "DELIVERED" &&
      booking.jobCard?.status !== "COMPLETED",
  ).length;

  const fetchServiceCenters = async () => {
    try {
      setLoadingCenters(true);
      const res = await fetch("https://victory-on-wheels-production.up.railway.app/service-center");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load service centers");
        return;
      }

      setServiceCenters(
        data.filter((center: ServiceCenter) => center.status === "ACTIVE"),
      );
    } catch (error) {
      console.error(error);
      alert("Unable to load service centers");
    } finally {
      setLoadingCenters(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await fetch("https://victory-on-wheels-production.up.railway.app/booking");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load bookings");
        return;
      }

      setBookings(
        data.filter(
          (booking: Booking) => booking.customerPhone === customerPhone,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Unable to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const res = await fetch(
        `https://victory-on-wheels-production.up.railway.app/vehicle?customerPhone=${customerPhone}`,
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load vehicles");
        return;
      }

      setVehicles(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load garage vehicles");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchCurrentJobCard = async () => {
    if (!customerPhone) return;

    try {
      setLoadingJobCard(true);

      const res = await fetch(
        `https://victory-on-wheels-production.up.railway.app/job-card/customer/latest?customerPhone=${customerPhone}`,
      );

      if (res.status === 404) {
        setCurrentJobCard(null);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load current job card");
        return;
      }

      setCurrentJobCard(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load current job card");
    } finally {
      setLoadingJobCard(false);
    }
  };

  const handleChange = (
    key: keyof BookServiceFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "city" ? { serviceCenterId: "" } : {}),
    }));
  };

  const handleBookService = async () => {
    if (!customerPhone) return alert("Please login again");
    if (!form.vehicleBrand) return alert("Please select vehicle brand");
    if (!form.vehicleModel) return alert("Please select vehicle model");
    if (!form.vehicleNumber.trim()) return alert("Please enter vehicle number");
    if (!form.serviceType.trim()) return alert("Please select service type");
    if (!form.city) return alert("Please select city");
    if (!form.serviceCenterId)
      return alert("Please select service center / area");
    if (!form.bookingDate) return alert("Please select preferred date");

    try {
      setSubmitting(true);

      const res = await fetch("https://victory-on-wheels-production.up.railway.app/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
          vehicleType: form.vehicleType,
          vehicleBrand: form.vehicleBrand,
          vehicleModel: form.vehicleModel,
          manufacturingYear: form.manufacturingYear
            ? Number(form.manufacturingYear)
            : undefined,
          fuelType: form.fuelType,
          transmission: form.transmission,
          odometer: form.odometer ? Number(form.odometer) : undefined,
          serviceType: form.serviceType,
          bookingDate: new Date(form.bookingDate).toISOString(),
          preferredTimeSlot: form.preferredTimeSlot,
          pickupRequired: form.pickupRequired,
          emergencyService: form.emergencyService,
          notes: form.notes,
          serviceCenterId: form.serviceCenterId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Service booking created successfully.");
      setForm(initialForm);
      fetchBookings();
      fetchVehicles();
      fetchCurrentJobCard();
      setActiveSection("dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating booking");
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loadingBookings) {
      return (
        <section className="customer-card">
          <p>Loading customer dashboard...</p>
        </section>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardView
            customerName={customerName}
            customerPhone={customerPhone}
            bookings={bookings}
            vehiclesCount={vehicles.length}
            currentJobCard={currentJobCard}
            loadingJobCard={loadingJobCard}
            onOpenSection={setActiveSection}
          />
        );

      case "garage":
        return (
          <GarageView vehicles={vehicles} loadingVehicles={loadingVehicles} />
        );

      case "book-service":
        return (
          <BookServiceView
            form={form}
            cities={cities}
            filteredCenters={filteredCenters}
            loadingCenters={loadingCenters}
            submitting={submitting}
            vehicles={vehicles}
            onChange={handleChange}
            onSubmit={handleBookService}
          />
        );

      case "bookings":
        return <BookingsView bookings={bookings} />;

      case "job-card":
        return (
          <JobCardView
            currentJobCard={currentJobCard}
            loadingJobCard={loadingJobCard}
          />
        );

      case "photos":
        return (
          <PhotosVideosView attachments={currentJobCard?.attachments || []} />
        );

      case "invoices":
        return <InvoiceView />;

      case "payments":
        return <InvoiceView />;

      case "profile":
        return (
          <ProfileView
            customerName={customerName}
            customerPhone={customerPhone}
            vehiclesCount={vehicles.length}
            bookingsCount={bookings.length}
            completedBookings={completedBookings}
            pendingBookings={pendingBookings}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-container">
        <div className="customer-shell">
          <CustomerSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="customer-main-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
