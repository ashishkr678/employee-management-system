import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    }
  }, [isOpen]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (newPassword && !passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, including uppercase, lowercase, a digit, and a special character.";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      newErrors.newPassword =
        "New password cannot be the same as the old password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.put(
        "http://localhost:8080/api/admin/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const successMessage =
        response.data.message || "Password changed successfully...";
      toast.success(successMessage);
      onClose();
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          typeof errorData === "string" ? errorData : errorData?.message;

        if (errorMessage === "Current password is incorrect!") {
          setErrors((prev) => ({ ...prev, currentPassword: errorMessage }));
        } else {
          toast.error(errorMessage || "Failed to change password. Please try again.");
        }
      } else {
        toast.error("Failed to change password. Please try again.");
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
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={currentPassword}
                placeholder="Enter current password"
                onChange={handleInputChange(
                  setCurrentPassword,
                  "currentPassword"
                )}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswords.currentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
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
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                placeholder="Enter new password"
                onChange={handleInputChange(setNewPassword, "newPassword")}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswords.newPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Re-enter new password"
                onChange={handleInputChange(
                  setConfirmPassword,
                  "confirmPassword"
                )}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswords.confirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end mb-4">
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

          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangePasswordModal;
