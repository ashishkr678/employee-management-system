export const loginUser = async ({ username, password }) => {
  try {
    const response = await fetch("http://localhost:8080/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.error === "Invalid username or password!") {
        throw new Error("Invalid username or password!");
      }
      throw new Error(errorData.message || "Login failed. Please try again.");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    throw error;
  }
};
