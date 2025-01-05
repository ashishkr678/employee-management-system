import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Profile from "./components/admin/pages/Profile";
import EmployeeDetail from "./components/employee/EmployeeDetail";
import EmployeesList from "./components/employee/EmployeesList";
import ForgotPassword from "./components/admin/pages/ForgotPassword";
import AddEmployee from "./components/employee/AddEmployee";
import Login from "./components/admin/pages/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/check-auth",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
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
    <Router>
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/employees" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ForgotPassword setIsAuthenticated={setIsAuthenticated} />
              }
            />

            {isAuthenticated ? (
              <>
                <Route path="/employees" element={<EmployeesList />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route
                  path="*"
                  element={<Navigate to={window.location.pathname} />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </main>

        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
};

export default App;
