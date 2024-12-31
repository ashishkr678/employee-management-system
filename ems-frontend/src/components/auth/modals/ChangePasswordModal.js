import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [isOpen]);

  const validateFields = () => {
    const newErrors = {};

    if (!currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    if (newPassword === currentPassword)
      newErrors.newPassword = "New password cannot be the same as the current password.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const username = localStorage.getItem("username");
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ username, currentPassword, newPassword }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        let errorData;

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = { message: await response.text() };
        }

        if (errorData.message === "Current password is incorrect!") {
          throw new Error("Current password is incorrect!");
        }
        throw new Error(
          errorData.message ||
            "Failed to change password. Please try again later."
        );
      }

      const contentType = response.headers.get("Content-Type");
      let successMessage;

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        successMessage = data.message || "Password changed successfully!";
      } else {
        successMessage = await response.text();
      }

      toast.success(successMessage);
      onClose();
    } catch (error) {
      if (error instanceof TypeError || !error.message) {
        toast.error("Failed to change password. Please try again later.");
      } else if (error.message === "Current password is incorrect!") {
        setErrors((prev) => ({ ...prev, currentPassword: error.message }));
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-4">
            Change Password
          </h3>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleInputChange(
                setCurrentPassword,
                "currentPassword"
              )}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.currentPassword ? "border-red-500" : ""
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleInputChange(setNewPassword, "newPassword")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.newPassword ? "border-red-500" : ""
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange(
                setConfirmPassword,
                "confirmPassword"
              )}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangePasswordModal;
