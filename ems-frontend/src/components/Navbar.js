import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./admin/auth/auth";
import api from "../apiConfig/ApiConfig";

const Navbar = ({ setIsAuthenticated }) => {
  const [searchId, setSearchId] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredEmployees([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const response = await api.get(`/employees/${query}`);
      const employee = response.data ? [response.data] : [];
      setFilteredEmployees(employee);
      setIsDropdownOpen(true);
    } catch (error) {
      setFilteredEmployees([]);
      setIsDropdownOpen(true);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged Out!");
      setIsAuthenticated(false);
      navigate("/");
    } else {
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchId(query);
    handleSearch(query);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
      setSearchId("");
    }
  };

  const handleEmployeeClick = (id) => {
    setIsDropdownOpen(false);
    setSearchId("");
    navigate(`/employees/${id}`);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white py-3 px-6 flex items-center justify-between">
      {/* Logo */}
      <Link to="/employees" className="text-lg font-bold transition-colors">
        Employee Management Application
      </Link>

      {/* Search Bar */}
      <div ref={searchRef} className="relative w-1/3 mx-auto">
        <div
          className={`flex items-center bg-white ${
            isDropdownOpen ? "rounded-t-2xl" : "rounded-full"
          } transition-[border-radius] duration-200`}
        >
          <input
            type="text"
            placeholder="Search Employee By ID"
            value={searchId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-transparent text-gray-800 outline-none placeholder-gray-500 transition-all duration-100"
          />
          <div className="px-3 py-2 text-gray-800 font-bold">
            <FiSearch size={18} />
          </div>
        </div>

        {/* Search Result Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white text-gray-800 shadow-md rounded-b-2xl z-10">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee.id)}
                  className="px-4 py-2 hover:cursor-pointer"
                >
                  {employee.firstName} {employee.lastName}
                </div>
              ))
            ) : (
              <div className="px-4 py-2">No Employee Found</div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-6">
        <Link
          to="/add-employee"
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          Add Employee
        </Link>
        <Link
          to="/profile"
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          My Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
