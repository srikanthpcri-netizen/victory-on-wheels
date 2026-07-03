import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import { paymentService, type Payment } from "../services/paymentService";

const getStatusColor = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return "green";
    case "FAILED":
      return "red";
    case "PENDING":
      return "orange";
    default:
      return "default";
  }
};

export default function Payments() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnsType<Payment> = [
    {
      title: "Payment ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      key: "invoiceId",
      render: (val) => val || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val) => (val ? `₹${val}` : "-"),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (val) => val || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val: string) => (
        <Tag color={getStatusColor(val || "PENDING")}>{val || "PENDING"}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
  ];

  return (
    <>
      <PageHeader title="Payments" subtitle="Track all payment transactions" />

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
