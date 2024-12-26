import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import { Toaster, toast } from "react-hot-toast";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [filteredEmployee, setFilteredEmployee] = useState(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employees");
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Reset search and filteredEmployee state when navigating back
  useEffect(() => {
    setFilteredEmployee(null);
    setSearchId("");
  }, [location]);

  const handleSearch = () => {
    const employee = employees.find((emp) => emp.id.toString() === searchId);
    if (employee) {
      setFilteredEmployee(employee);
    } else {
      toast.error("Employee Not Found!", {
        position: "top-center",
        duration: 3000,
      });
      setFilteredEmployee(null);
    }
    setSearchId("");
  };

  const handleEmployeeAdded = () => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching updated employees:", error);
      }
    };

    fetchEmployees();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 flex flex-col justify-start items-center">
      {/* Hot Toast Container */}
      <Toaster />

      {/* Buttons Section */}
      <div className="flex justify-center space-x-4 mb-6 mt-6">
        <button
          onClick={() => setIsAddEmployeeOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold shadow-lg hover:scale-110 transform transition-all duration-300"
        >
          Add Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      <AddEmployee
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />

      {/* Search Section */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 w-80 border border-gray-300 rounded-full shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-semibold shadow-lg hover:scale-110 transform transition-all duration-300"
        >
          Search
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-6xl px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-300">
                <tr>
                  <th className="px-6 py-3 border border-gray-300 text-left font-semibold text-gray-800">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left font-semibold text-gray-800">
                    First Name
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left font-semibold text-gray-800">
                    Last Name
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left font-semibold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(filteredEmployee ? [filteredEmployee] : employees).map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gradient-to-r from-purple-50 to-purple-100"
                    >
                      <td className="px-6 py-4 border border-gray-300">
                        {employee.id}
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        {employee.firstName}
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        {employee.lastName}
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <Link
                          to={`/employees/${employee.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
