import api from "../../../apiConfig/ApiConfig";

export const loginUser = async ({ username, password }) => {
  try {
    const response = await api.post("/admin/login", { username, password });

    if (response.status >= 400) {
      throw new Error(response.data.message || "Login failed. Please try again.");
    }

    return "Login successful..";
  } catch (error) {
    if (error.response && error.response.data) {
      const serverErrorMessage = error.response.data.message;
      throw new Error(serverErrorMessage || "Login failed. Please try again.");
    } else {
      throw new Error("Login failed. Please try again later.");
    }
  }
};

export const logout = async () => {
  try {
    const response = await api.put("/admin/logout", {});
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: response.data };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
