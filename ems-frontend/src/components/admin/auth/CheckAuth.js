import api from "../../../apiConfig/ApiConfig";

export const CheckAuth = async () => {
  try {
    const response = await api.get("/admin/check-auth");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
