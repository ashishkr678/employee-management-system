import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmployeesList from "./components/EmployeesList";
import EmployeeDetail from "./components/EmployeeDetail";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import AddEmployee from "./components/AddEmployee";
import ForgotPassword from "./components/auth/ForgotPassword";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/employees" /> : <Login setIsAuthenticated={setIsAuthenticated} />
              }
            />
            
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {isAuthenticated && (
              <>
                <Route path="/employees" element={<EmployeesList />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="*" element={<Navigate to="/employees" />} />
              </>
            )}

            {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
          </Routes>
        </main>
        
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
};

export default App;
