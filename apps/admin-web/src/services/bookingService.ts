import api from "../api/api";

export type Booking = {
  id: string;
  customerName: string;
  vehicleNumber: string;
  serviceType: string;
  bookingDate: string;
  status: string;
  serviceCenterId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/booking");
  return response.data;
};
