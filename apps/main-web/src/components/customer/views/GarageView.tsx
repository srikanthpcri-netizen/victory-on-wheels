import MyGarage from "../MyGarage";
import type { Vehicle } from "../MyGarage";

type Props = {
  vehicles: Vehicle[];
  loadingVehicles: boolean;
};

export default function GarageView({ vehicles, loadingVehicles }: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>My Garage</h2>

      {loadingVehicles ? (
        <p>Loading vehicles...</p>
      ) : (
        <MyGarage vehicles={vehicles} />
      )}
    </section>
  );
}
