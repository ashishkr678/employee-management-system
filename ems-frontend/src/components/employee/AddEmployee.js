import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../apiConfig/ApiConfig";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSave = async () => {
    const { firstName, lastName, email } = formData;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
    };

    let hasError = false;

    if (!firstName) {
      newErrors.firstName = "First name is required!";
      hasError = true;
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required!";
      hasError = true;
    }

    if (!email) {
      newErrors.email = "Email is required!";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address!";
        hasError = true;
      }
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      await api.post("/employees", formData);
      toast.success("Employee added successfully!");
      navigate("/employees");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrors((prev) => ({ ...prev, email: "This email already exists!" }));
      } else {
        toast.error("Error adding employee. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
        </div>

        {/* First Name Field */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-semibold mb-2"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800 placeholder-gray-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="flex items-center text-red-500 text-sm mt-1">
              <FaExclamationCircle className="mr-2" /> {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name Field */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800 placeholder-gray-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="flex items-center text-red-500 text-sm mt-1">
              <FaExclamationCircle className="mr-2" /> {errors.lastName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800 placeholder-gray-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="flex items-center text-red-500 text-sm mt-1">
              <FaExclamationCircle className="mr-2" /> {errors.email}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white font-semibold rounded-md shadow-md hover:scale-105 transform transition-all duration-300"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
