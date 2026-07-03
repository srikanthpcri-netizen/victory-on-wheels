import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import { getAllBookings } from "../services/bookingService";
import type { Booking } from "../services/bookingService";

type BookingRow = {
  key: string;
  bookingId: string;
  customerName: string;
  vehicleNumber: string;
  serviceType: string;
  bookingDate: string;
  status: string;
};

export default function Bookings() {
  const [data, setData] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res: Booking[] = await getAllBookings();

      const formatted = res.map((item) => ({
        key: item.id,
        bookingId: item.id,
        customerName: item.customerName,
        vehicleNumber: item.vehicleNumber,
        serviceType: item.serviceType,
        bookingDate: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
        status: item.status,
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "IN_PROGRESS":
        return "orange";
      case "READY_FOR_DELIVERY":
        return "gold";
      case "COMPLETED":
        return "green";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<BookingRow> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <PageHeader
        title="Bookings"
        subtitle="Track customer bookings and their current progress"
      />

      <ContentCard title="Booking List">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      </ContentCard>
    </Space>
  );
}
