import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../apiConfig/ApiConfig";
import { FaSpinner } from "react-icons/fa";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        setEmployee(response.data);
        setFormData(response.data);
      } catch (error) {
        toast.error("Something Wrong. Try Again Later!");
        navigate("/employees");
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(employee);
    setErrors({});
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.firstName || formData.firstName.trim() === "")
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName || formData.lastName.trim() === "")
      newErrors.lastName = "Last Name is required.";
    if (!formData.email || formData.email.trim() === "")
      newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address.";
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await api.put(`/employees/${id}`, formData);
      setEmployee(formData);
      setIsEditing(false);
      setErrors({});
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error.response || error);
      toast.error("Failed to update employee.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to delete employee.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleBack = () => navigate(-1);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200">
      <h1 className="text-3xl font-bold mt-6">Employee Details</h1>
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Employee ID</label>
          <p>{employee.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">First Name</label>
          {isEditing ? (
            <>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full border px-3 py-2 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </>
          ) : (
            <p>{employee.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Last Name</label>
          {isEditing ? (
            <>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full border px-3 py-2 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </>
          ) : (
            <p>{employee.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Email</label>
          {isEditing ? (
            <>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border px-3 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </>
          ) : (
            <p>{employee.email}</p>
          )}
        </div>
        <div className="flex space-x-4 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
