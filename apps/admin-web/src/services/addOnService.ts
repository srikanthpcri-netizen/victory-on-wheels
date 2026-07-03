import api from "../api/api";

export type AddOn = {
  id: string;
  jobCardId?: string | null;
  name?: string | null;
  title?: string | null;
  itemName?: string | null;
  description?: string | null;
  notes?: string | null;
  amount?: number | null;
  price?: number | null;
  cost?: number | null;
  status?: string | null;
  approvalStatus?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
};

const getAll = async (): Promise<AddOn[]> => {
  const res = await api.get("/add-on");
  return res.data;
};

export const addOnService = {
  getAll,
};
