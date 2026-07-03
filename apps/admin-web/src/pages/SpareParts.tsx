import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Tag,
  Switch,
  Popconfirm,
} from "antd";
import {
  getSpareParts,
  createSparePart,
  updateSparePart,
  deleteSparePart,
} from "../api/sparePartService";
import type {
  SparePart,
  SparePartType,
  CreateSparePartPayload,
} from "../api/sparePartService";

const { Option } = Select;

type SparePartFormValues = {
  name: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  unit?: string;
  stockQty?: string | number;
  price?: string | number;
  type?: SparePartType;
  isActive?: boolean;
};

export default function SpareParts() {
  const [data, setData] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"OEM" | "OES" | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [form] = Form.useForm<SparePartFormValues>();

  const isEditMode = !!editingPart;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSpareParts({
        search: search || undefined,
        type: typeFilter,
      });
      setData(res);
    } catch (error) {
      console.error(error);
      message.error("Failed to load spare parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, typeFilter]);

  const openCreateModal = () => {
    setEditingPart(null);
    form.resetFields();
    form.setFieldsValue({
      type: "OEM",
      isActive: true,
      stockQty: 0,
      price: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (record: SparePart) => {
    setEditingPart(record);
    form.setFieldsValue({
      name: record.name,
      partNumber: record.partNumber || "",
      category: record.category || "",
      brand: record.brand || "",
      unit: record.unit || "",
      stockQty: record.stockQty ?? 0,
      price: record.price ?? 0,
      type: record.type,
      isActive: record.isActive,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPart(null);
    form.resetFields();
  };

  const buildPayload = (
    values: SparePartFormValues,
  ): CreateSparePartPayload => {
    return {
      name: values.name.trim(),
      partNumber: values.partNumber?.trim() || undefined,
      category: values.category?.trim() || undefined,
      brand: values.brand?.trim() || undefined,
      unit: values.unit?.trim() || undefined,
      stockQty:
        values.stockQty !== undefined && values.stockQty !== ""
          ? Number(values.stockQty)
          : 0,
      price:
        values.price !== undefined && values.price !== ""
          ? Number(values.price)
          : 0,
      type: values.type || "OEM",
      isActive: values.isActive ?? true,
    };
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = buildPayload(values);

      setSaveLoading(true);

      if (isEditMode && editingPart) {
        await updateSparePart(editingPart.id, payload);
        message.success("Spare part updated successfully");
      } else {
        await createSparePart(payload);
        message.success("Spare part created successfully");
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      console.error(error);
      message.error(
        isEditMode
          ? "Failed to update spare part"
          : "Failed to create spare part",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoadingId(id);
      await deleteSparePart(id);
      message.success("Spare part deleted successfully");
      loadData();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete spare part");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const columns = [
    {
      title: "Part Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (value: string | undefined) => value || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value: string | undefined) => value || "-",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (value: string | undefined) => value || "-",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value: "OEM" | "OES") => (
        <Tag color={value === "OEM" ? "gold" : "red"}>{value}</Tag>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (value: string | undefined) => value || "-",
    },
    {
      title: "Stock",
      dataIndex: "stockQty",
      key: "stockQty",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `₹${Number(value || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: SparePart) => (
        <Space>
          <Button type="primary" ghost onClick={() => openEditModal(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete Spare Part"
            description="Are you sure you want to delete this spare part?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger loading={deleteLoadingId === record.id}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#111111" }}>Spare Parts Master</h2>
          <p style={{ margin: "6px 0 0", color: "#666666" }}>
            Manage OEM and OES spare parts for service center requests.
          </p>
        </div>

        <Button
          type="primary"
          onClick={openCreateModal}
          style={{
            background: "#ff0000",
            borderColor: "#ff0000",
            fontWeight: 700,
          }}
        >
          + Add Part
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name, part number, category, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />

        <Select
          placeholder="Filter Type"
          allowClear
          style={{ width: 160 }}
          value={typeFilter}
          onChange={(val) => setTypeFilter(val)}
        >
          <Option value="OEM">OEM</Option>
          <Option value="OES">OES</Option>
        </Select>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={isEditMode ? "Edit Spare Part" : "Add Spare Part"}
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={handleSave}
        okText={
          saveLoading ? "Saving..." : isEditMode ? "Update Part" : "Save Part"
        }
        confirmLoading={saveLoading}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            type: "OEM",
            isActive: true,
            stockQty: 0,
            price: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Part Name"
            rules={[{ required: true, message: "Please enter part name" }]}
          >
            <Input placeholder="Enter spare part name" />
          </Form.Item>

          <Form.Item name="partNumber" label="Part Number">
            <Input placeholder="Enter part number" />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Input placeholder="Enter category" />
          </Form.Item>

          <Form.Item name="brand" label="Brand">
            <Input placeholder="Enter brand" />
          </Form.Item>

          <Form.Item name="unit" label="Unit">
            <Input placeholder="Example: pcs, set, box" />
          </Form.Item>

          <Form.Item
            name="stockQty"
            label="Stock Qty"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <Input type="number" min={0} placeholder="Enter stock quantity" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Enter part price"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select>
              <Option value="OEM">OEM</Option>
              <Option value="OES">OES</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
