import { useEffect, useState } from "react";
import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import AddServiceCenterModal from "./AddServiceCenterModal";
import {
  serviceCenterService,
  type ServiceCenter,
} from "../services/serviceCenterService";

export default function ServiceCenters() {
  const [items, setItems] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingServiceCenter, setEditingServiceCenter] =
    useState<ServiceCenter | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadServiceCenters = async () => {
    try {
      setLoading(true);
      const data = await serviceCenterService.getAll();
      setItems(data);
    } catch (error) {
      console.error("Failed to load service centers:", error);
      message.error("Failed to load service centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceCenters();
  }, []);

  const handleOpenAdd = () => {
    setEditingServiceCenter(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (record: ServiceCenter) => {
    setEditingServiceCenter(record);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingServiceCenter(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await serviceCenterService.remove(id);
      message.success("Service center deleted successfully");
      await loadServiceCenters();
    } catch (error) {
      console.error("Failed to delete service centers:", error);
      message.error("Failed to delete service center");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<ServiceCenter> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (value: number | null | undefined) => `₹${value ?? 0}`,
    },
    {
      title: "Used Credit",
      dataIndex: "usedCredit",
      key: "usedCredit",
      render: (value: number | null | undefined) => `₹${value ?? 0}`,
    },
    {
      title: "Available Credit",
      key: "availableCredit",
      render: (_: unknown, record: ServiceCenter) => {
        const creditLimit = record.creditLimit ?? 0;
        const usedCredit = record.usedCredit ?? 0;
        const availableCredit = Math.max(creditLimit - usedCredit, 0);
        return `₹${availableCredit}`;
      },
    },
    {
      title: "Outstanding",
      dataIndex: "outstandingAmount",
      key: "outstandingAmount",
      render: (value: number | null | undefined) => `₹${value ?? 0}`,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (value: string | null | undefined) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string | null | undefined) => {
        const status = value || "ACTIVE";
        return status === "ACTIVE" ? (
          <Tag color="green">ACTIVE</Tag>
        ) : (
          <Tag color="red">INACTIVE</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ServiceCenter) => (
        <Space>
          <Button type="primary" ghost onClick={() => handleOpenEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete Service Center"
            description="Are you sure you want to delete this service center?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger loading={deletingId === record.id}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Service Centers"
        subtitle="Manage all registered service centers"
        extra={
          <Button type="primary" onClick={handleOpenAdd}>
            Add Service Center
          </Button>
        }
      />

      <ContentCard>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </ContentCard>

      <AddServiceCenterModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={loadServiceCenters}
        editingServiceCenter={editingServiceCenter}
      />
    </>
  );
}
