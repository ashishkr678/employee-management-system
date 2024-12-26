import React, { useState } from "react";
import axios from "axios";

const AddEmployee = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/api/employees", formData);
      setSuccessMessage("Employee is added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onEmployeeAdded(); // Trigger list update
        onClose(); // Close the dialog
      }, 2000);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      {/* Dialog */}
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Success Message */}
        {successMessage && (
          <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 rounded-t-lg">
            {successMessage}
          </div>
        )}

        {/* Dialog Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Employee</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
