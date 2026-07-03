import api from "./api";

export type SparePartType = "OEM" | "OES";

export interface SparePart {
  id: string;
  name: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  unit?: string;
  stockQty: number;
  price: number;
  isActive: boolean;
  type: SparePartType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSparePartPayload {
  name: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  unit?: string;
  stockQty?: number;
  price?: number;
  isActive?: boolean;
  type?: SparePartType;
}

export interface UpdateSparePartPayload {
  name?: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  unit?: string;
  stockQty?: number;
  price?: number;
  isActive?: boolean;
  type?: SparePartType;
}

export async function getSpareParts(params?: {
  search?: string;
  type?: SparePartType;
  activeOnly?: boolean;
}) {
  const response = await api.get<SparePart[]>("/spare-part", {
    params,
  });
  return response.data;
}

export async function getSparePartById(id: string) {
  const response = await api.get<SparePart>(`/spare-part/${id}`);
  return response.data;
}

export async function createSparePart(payload: CreateSparePartPayload) {
  const response = await api.post<SparePart>("/spare-part", payload);
  return response.data;
}

export async function updateSparePart(
  id: string,
  payload: UpdateSparePartPayload,
) {
  const response = await api.patch<SparePart>(`/spare-part/${id}`, payload);
  return response.data;
}

export async function deleteSparePart(id: string) {
  const response = await api.delete(`/spare-part/${id}`);
  return response.data;
}
