import api from "../api/api";

export type Payment = {
  id: string;
  invoiceId?: string;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
};

const getAll = async (): Promise<Payment[]> => {
  const res = await api.get("/payment-transaction");
  return res.data;
};

export const paymentService = {
  getAll,
};
