import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../apiConfig/ApiConfig";

const ChangePhoneModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [rePhone, setRePhone] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ phone: false, rePhone: false });

  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setRePhone("");
      setErrors({});
      setTouched({ phone: false, rePhone: false });
    }
  }, [isOpen]);

  const validatePhone = (value) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(value);
  };

  const handleSave = async () => {
    setErrors({});
    setTouched({ phone: true, rePhone: true });

    let hasError = false;

    if (!phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter your phone number!",
      }));
      hasError = true;
    } else if (!validatePhone(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be 10 digits long and contain only numbers!",
      }));
      hasError = true;
    }

    if (!rePhone) {
      setErrors((prev) => ({
        ...prev,
        rePhone: "Please re-enter your phone number!",
      }));
      hasError = true;
    } else if (!validatePhone(rePhone)) {
      setErrors((prev) => ({
        ...prev,
        rePhone: "Phone number must be 10 digits long and contain only numbers!",
      }));
      hasError = true;
    } else if (phone !== rePhone) {
      setErrors((prev) => ({
        ...prev,
        rePhone: "Phone numbers do not match!",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await api.put("/admin/update-phone", {
        newPhoneNumber: phone,
      });
      if (response.status === 200) {
        toast.success("Phone number updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update phone number. Please try again later.");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to update phone number. Please try again later.");
    }
  };

  const handleInputChange = (field, value) => {
    if (touched[field] && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (field === "phone") {
      setPhone(value);
    } else {
      setRePhone(value);
    }
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-4">
            Change Phone Number
          </h3>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              New Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              onFocus={() => handleFocus("phone")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Re-enter Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Re-enter Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rePhone}
              onChange={(e) => handleInputChange("rePhone", e.target.value)}
              onFocus={() => handleFocus("rePhone")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.rePhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Re-enter your phone number"
            />
            {touched.rePhone && errors.rePhone && (
              <p className="text-red-500 text-sm mt-1">{errors.rePhone}</p>
            )}
          </div>

          {/* Buttons */}
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

export default ChangePhoneModal;
