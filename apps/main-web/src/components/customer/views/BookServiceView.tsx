import BookServiceForm from "../BookServiceForm";
import type { BookServiceFormData } from "../BookServiceForm";
import type { VehicleType } from "../../../data/vehicleData";

type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone: string;
  status: string;
};

type Vehicle = {
  id: string;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  registrationNumber: string;
  manufacturingYear?: number;
  fuelType?: string;
  transmission?: string;
  odometer?: number;
};

type Props = {
  form: BookServiceFormData;
  cities: string[];
  filteredCenters: ServiceCenter[];
  loadingCenters: boolean;
  submitting: boolean;
  vehicles: Vehicle[];
  onChange: (key: keyof BookServiceFormData, value: string | boolean) => void;
  onSubmit: (amount: number) => void;
};

export default function BookServiceView({
  form,
  cities,
  filteredCenters,
  loadingCenters,
  submitting,
  vehicles,
  onChange,
  onSubmit,
}: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>Book Service</h2>
      <p style={{ color: "#666" }}>
        Select your saved vehicle or add a new vehicle to book service.
      </p>

      <BookServiceForm
        form={form}
        cities={cities}
        filteredCenters={filteredCenters}
        loadingCenters={loadingCenters}
        submitting={submitting}
        onChange={onChange}
        onSubmit={onSubmit}
        garageVehicles={vehicles}
      />
    </section>
  );
}
