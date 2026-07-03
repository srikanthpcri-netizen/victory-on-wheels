import { useEffect, useState } from "react";
import api from "../api/api";

type SparePartRequestItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  snapshotName: string;
  snapshotPartNumber: string;
  snapshotCategory: string;
  snapshotBrand: string;
  snapshotType: "OEM" | "OES";
};

type SparePartRequest = {
  id: string;
  paymentMode: string;
  paidAmount: number;
  totalAmount: number;
  creditAmount: number;
  notes?: string | null;
  createdAt: string;
  serviceCenter: {
    id: string;
    name: string;
    city: string;
    phone: string;
  };
  items: SparePartRequestItem[];
};

export default function SparePartRequests() {
  const [requests, setRequests] = useState<SparePartRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/spare-part-request");
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load spare part requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const formatCurrency = (value?: number) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Spare Part Requests</h1>
        <p style={{ marginTop: 0, color: "#666", marginBottom: 24 }}>
          Detailed spare parts requests from service centers.
        </p>

        {loading ? (
          <p>Loading requests...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : requests.length === 0 ? (
          <p>No spare part requests found.</p>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {requests.map((request) => (
              <div
                key={request.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    padding: 16,
                    background: "#fafafa",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div>
                      <strong>Service Center</strong>
                      <div>{request.serviceCenter?.name || "-"}</div>
                    </div>
                    <div>
                      <strong>Payment Mode</strong>
                      <div>{request.paymentMode}</div>
                    </div>
                    <div>
                      <strong>Request Date</strong>
                      <div>{new Date(request.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                      <strong>Phone</strong>
                      <div>{request.serviceCenter?.phone || "-"}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <div>
                      <strong>Total Amount</strong>
                      <div>{formatCurrency(request.totalAmount)}</div>
                    </div>
                    <div>
                      <strong>Paid Amount</strong>
                      <div>{formatCurrency(request.paidAmount)}</div>
                    </div>
                    <div>
                      <strong>Credit Amount</strong>
                      <div>{formatCurrency(request.creditAmount)}</div>
                    </div>
                    <div>
                      <strong>City</strong>
                      <div>{request.serviceCenter?.city || "-"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <strong>Notes</strong>
                    <div>{request.notes || "-"}</div>
                  </div>
                </div>

                <div style={{ padding: 16, overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: 900,
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={thStyle}>Part Name</th>
                        <th style={thStyle}>Part Number</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Brand</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Qty</th>
                        <th style={thStyle}>Unit Price</th>
                        <th style={thStyle}>Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.items.map((item) => (
                        <tr key={item.id}>
                          <td style={tdStyle}>{item.snapshotName}</td>
                          <td style={tdStyle}>
                            {item.snapshotPartNumber || "-"}
                          </td>
                          <td style={tdStyle}>
                            {item.snapshotCategory || "-"}
                          </td>
                          <td style={tdStyle}>{item.snapshotBrand || "-"}</td>
                          <td style={tdStyle}>{item.snapshotType}</td>
                          <td style={tdStyle}>{item.quantity}</td>
                          <td style={tdStyle}>
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td style={tdStyle}>
                            {formatCurrency(item.lineTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
