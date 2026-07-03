import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import StatsCard from "../components/StatsCard";
import PageHeader from "../components/PageHeader";
import api from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    serviceCenters: 0,
    bookings: 0,
    jobCards: 0,
    invoices: 0,
    insurance: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      const [sc, bk, jc, inv, ins] = await Promise.all([
        api.get("/service-center"),
        api.get("/booking"),
        api.get("/job-card"),
        api.get("/invoice"),
        api.get("/insurance"),
      ]);

      setStats({
        serviceCenters: sc.data.length,
        bookings: bk.data.length,
        jobCards: jc.data.length,
        invoices: inv.data.length,
        insurance: ins.data.length,
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ padding: 0 }}>
      <PageHeader title="Dashboard" subtitle="Overview of system activity" />

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div
            style={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #f0f0f0",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <StatsCard title="Service Centers" value={stats.serviceCenters} />
            <StatsCard title="Bookings" value={stats.bookings} />
            <StatsCard title="Job Cards" value={stats.jobCards} />
            <StatsCard title="Invoices" value={stats.invoices} />
            <StatsCard title="Insurance Enquiries" value={stats.insurance} />
          </div>
        )}
      </div>
    </div>
  );
}
