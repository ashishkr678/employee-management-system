import axios from "axios";

export const CheckAuth = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/admin/check-auth", {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
