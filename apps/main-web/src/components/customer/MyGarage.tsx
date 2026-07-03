import type { VehicleType } from "../../data/vehicleData";
import "./MyGarage.css";

export type Vehicle = {
  id: string;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  registrationNumber: string;
  manufacturingYear?: number;
  fuelType?: string;
  transmission?: string;
  odometer?: number;
  color?: string;
  isDefault: boolean;
};

type Props = {
  vehicles: Vehicle[];
};

export default function MyGarage({ vehicles }: Props) {
  if (vehicles.length === 0) {
    return <div className="my-garage-empty">No vehicles added yet.</div>;
  }

  return (
    <div className="my-garage-list">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="my-garage-card">
          <div>
            <h3 className="my-garage-title">
              {vehicle.vehicleBrand} {vehicle.vehicleModel}
            </h3>

            <p className="my-garage-meta">
              Registration: <b>{vehicle.registrationNumber}</b>
            </p>

            <p className="my-garage-meta">
              {vehicle.vehicleType}
              {vehicle.manufacturingYear
                ? ` • ${vehicle.manufacturingYear}`
                : ""}
            </p>

            <p className="my-garage-meta">
              {vehicle.fuelType || "-"} • {vehicle.transmission || "-"}
            </p>

            <p className="my-garage-meta">
              {vehicle.odometer?.toLocaleString() || 0} km
            </p>

            {vehicle.color && (
              <p className="my-garage-meta">Color: {vehicle.color}</p>
            )}
          </div>

          <div>
            {vehicle.isDefault && (
              <span className="my-garage-badge">Default Vehicle</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
