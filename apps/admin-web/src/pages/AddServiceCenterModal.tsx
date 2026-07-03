import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import {
  serviceCenterService,
  type ServiceCenter,
} from "../services/serviceCenterService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingServiceCenter?: ServiceCenter | null;
};

type FormValues = {
  name: string;
  city: string;
  phone: string;
  address?: string;
  status?: string;
  creditLimit?: number;
  usedCredit?: number;
  outstandingAmount?: number;
};

export default function AddServiceCenterModal({
  open,
  onClose,
  onSuccess,
  editingServiceCenter,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const isEditMode = !!editingServiceCenter;

  useEffect(() => {
    if (open) {
      if (editingServiceCenter) {
        form.setFieldsValue({
          name: editingServiceCenter.name,
          city: editingServiceCenter.city,
          phone: editingServiceCenter.phone,
          address: editingServiceCenter.address || "",
          status: editingServiceCenter.status || "ACTIVE",
          creditLimit: editingServiceCenter.creditLimit ?? 0,
          usedCredit: editingServiceCenter.usedCredit ?? 0,
          outstandingAmount: editingServiceCenter.outstandingAmount ?? 0,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "ACTIVE",
          creditLimit: 0,
          usedCredit: 0,
          outstandingAmount: 0,
        });
      }
    }
  }, [open, editingServiceCenter, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && editingServiceCenter) {
        await serviceCenterService.update(editingServiceCenter.id, {
          name: values.name,
          city: values.city,
          phone: values.phone,
          address: values.address || "",
          status: values.status || "ACTIVE",
          creditLimit: values.creditLimit ?? 0,
          usedCredit: values.usedCredit ?? 0,
          outstandingAmount: values.outstandingAmount ?? 0,
        });

        message.success("Service center updated successfully");
      } else {
        await serviceCenterService.create({
          name: values.name,
          city: values.city,
          phone: values.phone,
          address: values.address || "",
          status: values.status || "ACTIVE",
          creditLimit: values.creditLimit ?? 0,
          usedCredit: values.usedCredit ?? 0,
          outstandingAmount: values.outstandingAmount ?? 0,
        });

        message.success("Service center added successfully");
      }

      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Service center save failed:", error);
      message.error(
        isEditMode
          ? "Failed to update service center"
          : "Failed to add service center",
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditMode ? "Edit Service Center" : "Add Service Center"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isEditMode ? "Update" : "Save"}
      cancelText="Cancel"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Service Center Name"
          name="name"
          rules={[
            { required: true, message: "Please enter service center name" },
          ]}
        >
          <Input placeholder="Enter service center name" />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please enter city" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea rows={3} placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Credit Limit"
          name="creditLimit"
          rules={[{ required: true, message: "Please enter credit limit" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter credit limit"
          />
        </Form.Item>

        <Form.Item
          label="Used Credit"
          name="usedCredit"
          rules={[{ required: true, message: "Please enter used credit" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter used credit"
          />
        </Form.Item>

        <Form.Item
          label="Outstanding Amount"
          name="outstandingAmount"
          rules={[
            { required: true, message: "Please enter outstanding amount" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter outstanding amount"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
            placeholder="Select status"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
