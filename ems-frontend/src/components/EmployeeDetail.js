import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/employees/${id}`
        );
        setEmployee(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/employees/${id}`,
        formData
      );
      setEmployee(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving employee details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/employees/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!employee) {
    return <p>Loading employee details...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mt-6">Employee Details</h1>
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">First Name</label>
          {isEditing ? (
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          ) : (
            <p>{employee.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Last Name</label>
          {isEditing ? (
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          ) : (
            <p>{employee.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Email</label>
          {isEditing ? (
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          ) : (
            <p>{employee.email}</p>
          )}
        </div>
        <div className="flex space-x-4 mt-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
