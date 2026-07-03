import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import { addOnService, type AddOn } from "../services/addOnService";

const getDisplayName = (record: AddOn) => {
  return record.name || record.title || record.itemName || "-";
};

const getDisplayDescription = (record: AddOn) => {
  return record.description || record.notes || "-";
};

const getDisplayAmount = (record: AddOn) => {
  const value = record.amount ?? record.price ?? record.cost ?? null;
  return typeof value === "number" ? `₹${value}` : "-";
};

const getDisplayStatus = (record: AddOn) => {
  return record.status || record.approvalStatus || "PENDING";
};

const getStatusColor = (status: string) => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "APPROVED":
    case "ACTIVE":
      return "green";

    case "PENDING":
      return "orange";

    case "REJECTED":
    case "INACTIVE":
      return "red";

    case "REQUESTED":
      return "blue";

    default:
      return "default";
  }
};

export default function AddOns() {
  const [items, setItems] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await addOnService.getAll();
      setItems(data);
    } catch (error) {
      console.error("Failed to load add-ons:", error);
      message.error("Failed to load add-ons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnsType<AddOn> = [
    {
      title: "Add-On ID",
      dataIndex: "id",
      key: "id",
      render: (value: string) => value || "-",
    },
    {
      title: "Job Card ID",
      dataIndex: "jobCardId",
      key: "jobCardId",
      render: (value: string | null | undefined) => value || "-",
    },
    {
      title: "Name",
      key: "name",
      render: (_: unknown, record: AddOn) => getDisplayName(record),
    },
    {
      title: "Description",
      key: "description",
      render: (_: unknown, record: AddOn) => getDisplayDescription(record),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: unknown, record: AddOn) => getDisplayAmount(record),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: AddOn) => {
        const status = getDisplayStatus(record);
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string | null | undefined) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
  ];

  return (
    <>
      <PageHeader
        title="Add-Ons"
        subtitle="Manage service add-ons and approvals"
      />

      <ContentCard>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      </ContentCard>
    </>
  );
}
