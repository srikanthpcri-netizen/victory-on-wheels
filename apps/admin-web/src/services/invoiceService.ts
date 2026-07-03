import api from "../api/api";

export type Invoice = {
  id: string;
  jobCardId?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: string;
  createdAt?: string;
};

const getAll = async (): Promise<Invoice[]> => {
  const res = await api.get("/invoice");
  return res.data;
};

export const invoiceService = {
  getAll,
};
