import api from "../api/api";

export type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  phone: string;
  address?: string | null;
  status?: string | null;
  creditLimit?: number | null;
  usedCredit?: number | null;
  outstandingAmount?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateServiceCenterPayload = {
  name: string;
  city: string;
  phone: string;
  address?: string;
  status?: string;
  creditLimit?: number;
  usedCredit?: number;
  outstandingAmount?: number;
};

export type UpdateServiceCenterPayload = {
  name: string;
  city: string;
  phone: string;
  address?: string;
  status?: string;
  creditLimit?: number;
  usedCredit?: number;
  outstandingAmount?: number;
};

const getAll = async (): Promise<ServiceCenter[]> => {
  const response = await api.get("/service-center");
  return response.data;
};

const create = async (
  payload: CreateServiceCenterPayload,
): Promise<ServiceCenter> => {
  const response = await api.post("/service-center", payload);
  return response.data;
};

const update = async (
  id: string,
  payload: UpdateServiceCenterPayload,
): Promise<ServiceCenter> => {
  const response = await api.patch(`/service-center/${id}`, payload);
  return response.data;
};

const remove = async (id: string): Promise<void> => {
  await api.delete(`/service-center/${id}`);
};

export const serviceCenterService = {
  getAll,
  create,
  update,
  remove,
};
