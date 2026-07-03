type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone: string;
  status: string;
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
  booking?: {
    vehicleBrand?: string;
    vehicleModel?: string;
    serviceCenter?: ServiceCenter;
  };
};

type Props = {
  currentJobCard: CustomerJobCard | null;
  loadingJobCard: boolean;
};

export default function JobCardView({ currentJobCard, loadingJobCard }: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>Current Job Card</h2>

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
          <Detail
            label="Service Center"
            value={currentJobCard.booking?.serviceCenter?.name || "-"}
          />
          <Detail
            label="Estimated Amount"
            value={`₹${Number(
              currentJobCard.estimatedAmount || 0,
            ).toLocaleString("en-IN")}`}
          />
          <Detail
            label="Final Amount"
            value={`₹${Number(currentJobCard.finalAmount || 0).toLocaleString(
              "en-IN",
            )}`}
          />
          <Detail
            label="Problem Notes"
            value={currentJobCard.problemNotes || "-"}
          />
        </div>
      ) : (
        <p style={{ color: "#777" }}>No active job card found.</p>
      )}
    </section>
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
