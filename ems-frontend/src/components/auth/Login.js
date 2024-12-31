import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./auth";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrors({});
    setErrorMessage("");
  
    let hasError = false;
    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Please enter a username!" }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Please enter a password!" }));
      hasError = true;
    }
  
    if (hasError) return;
  
    try {
      const token = await loginUser({ username, password });
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      navigate("/employees");
    } catch (error) {
      if (error.message === "Invalid username or password!") {
        setErrorMessage("Invalid username or password!");
      } else if (error.message === "Login failed. Please try again.") {
        setErrorMessage("Login failed. Please try again.");
      } else {
        setErrorMessage("Login failed. Please try again later.");
      }
    }
  };
  

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-300 to-pink-200 flex flex-col">
      <p className="text-5xl font-bold text-gray-800 mt-10 text-center">
        Welcome to Employee Management Application
      </p>

      <div className="flex-grow flex items-center justify-center -mt-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Admin Login
          </h2>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="flex items-center text-red-500 text-sm mt-1">
                <FaExclamationCircle className="mr-2" /> {errors.username}
              </p>
            )}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 pr-10 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center text-red-500 text-sm mt-1">
                <FaExclamationCircle className="mr-2" /> {errors.password}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:scale-105 transform transition-all duration-300"
          >
            Login
          </button>

          <div className="flex justify-center items-center mt-6">
            <Link to="/" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          {errorMessage && (
            <p className="text-center text-red-500 text-sm mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
