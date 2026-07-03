import { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import ContentCard from "../components/ContentCard";
import PageHeader from "../components/PageHeader";
import { insuranceService } from "../services/insuranceService";

type InsuranceEnquiry = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  city: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  registrationNumber: string;
  manufacturingYear: number;
  previousPolicyProvider?: string | null;
  insuranceType?: string | null;
  policyExpiryDate?: string | null;
  claimHistory?: string | null;
  additionalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function Insurance() {
  const [data, setData] = useState<InsuranceEnquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsuranceEnquiries = async () => {
    try {
      setLoading(true);
      const result = await insuranceService.getAll();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to fetch insurance enquiries:", error);
      message.error("Failed to load insurance enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await insuranceService.delete(id);
      message.success("Insurance enquiry deleted successfully");
      fetchInsuranceEnquiries();
    } catch (error) {
      console.error("Failed to delete insurance enquiry:", error);
      message.error("Failed to delete insurance enquiry");
    }
  };

  useEffect(() => {
    fetchInsuranceEnquiries();
  }, []);

  const columns: ColumnsType<InsuranceEnquiry> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#111827" }}>
            {record.fullName}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {record.mobileNumber}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {record.email || "No email"}
          </div>
        </div>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Vehicle",
      key: "vehicle",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.vehicleBrand} {record.vehicleModel}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {record.vehicleType}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Reg: {record.registrationNumber}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Year: {record.manufacturingYear}
          </div>
        </div>
      ),
    },
    {
      title: "Insurance",
      key: "insurance",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color="gold">{record.insuranceType || "Not specified"}</Tag>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            Previous: {record.previousPolicyProvider || "N/A"}
          </span>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            Claim: {record.claimHistory || "N/A"}
          </span>
        </Space>
      ),
    },
    {
      title: "Notes",
      dataIndex: "additionalNotes",
      key: "additionalNotes",
      render: (value: string | null | undefined) => value || "-",
    },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) =>
        new Date(value).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Delete insurance enquiry"
          description="Are you sure you want to delete this enquiry?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Insurance Enquiries"
        subtitle="View all insurance form submissions from the public website"
      />

      <ContentCard>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </ContentCard>
    </>
  );
}
