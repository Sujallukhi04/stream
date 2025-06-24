import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  const response = await axiosInstance.get("/auth/user");
  return response.data;
};
