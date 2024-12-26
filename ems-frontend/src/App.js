import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmployeesList from "./components/EmployeesList";
import EmployeeDetail from "./components/EmployeeDetail";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<EmployeesList />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
