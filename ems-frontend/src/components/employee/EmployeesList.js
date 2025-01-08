import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../apiConfig/ApiConfig";

const EmployeesList = ({ refreshKey }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load employee data!");
        setLoading(true);
      }
    };

    fetchEmployees();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 flex flex-col justify-start items-center">
      {/* Table Section */}
      <div className="w-full max-w-6xl px-4 py-8">
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
                {employees.map((employee) => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
