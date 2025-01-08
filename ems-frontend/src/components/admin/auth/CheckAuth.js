import api from "../../../apiConfig/ApiConfig";

export const CheckAuth = async () => {
  try {
    const response = await api.get("/admin/check-auth");
    
    if (response.status === 200 && response.data.message === "Authenticated") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
