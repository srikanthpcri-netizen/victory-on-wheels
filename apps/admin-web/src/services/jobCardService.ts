import api from "../api/api";

export type JobCard = {
  id: string;
  bookingId: string;
  vehicleNumber: string;
  serviceType: string;
  problemNotes?: string | null;
  status: string;
  estimatedAmount?: number | null;
  finalAmount?: number | null;
  createdAt: string;
};

const getAll = async (): Promise<JobCard[]> => {
  const res = await api.get("/job-card");
  return res.data;
};

export const jobCardService = {
  getAll,
};
