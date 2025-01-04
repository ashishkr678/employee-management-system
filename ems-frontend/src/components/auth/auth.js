import axios from "axios";

export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/admin/login",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

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
    const response = await axios.put(
      "http://localhost:8080/api/admin/logout",
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: response.data };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
