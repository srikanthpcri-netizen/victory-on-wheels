import api from "../api/api";

export const insuranceService = {
  getAll: async () => {
    const response = await api.get("/insurance");
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/insurance/${id}`);
    return response.data;
  },
};
