import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import { jobCardService, type JobCard } from "../services/jobCardService";

export default function JobCards() {
  const [items, setItems] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await jobCardService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load job cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "IN_PROGRESS":
        return "blue";
      case "READY":
        return "green";
      case "DELIVERED":
        return "purple";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<JobCard> = [
    {
      title: "Vehicle",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Problem",
      dataIndex: "problemNotes",
      key: "problemNotes",
      render: (val) => val || "-",
    },
    {
      title: "Estimated",
      dataIndex: "estimatedAmount",
      key: "estimatedAmount",
      render: (val) => (val ? `₹${val}` : "-"),
    },
    {
      title: "Final",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (val) => (val ? `₹${val}` : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val: string) => <Tag color={getStatusColor(val)}>{val}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <>
      <PageHeader title="Job Cards" subtitle="Manage service job cards" />

      <ContentCard>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </ContentCard>
    </>
  );
}
