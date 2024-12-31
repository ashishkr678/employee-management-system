import React, { useState, useEffect } from "react";

const ChangeEmailModal = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setReEmail("");
      setErrors({});
    }
  }, [isOpen]);

  const handleSave = () => {
    setErrors({});
    let hasError = false;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Please enter your email!" }));
      hasError = true;
    }
    if (!reEmail) {
      setErrors((prev) => ({ ...prev, reEmail: "Please re-enter your email!" }));
      hasError = true;
    }
    if (email !== reEmail) {
      setErrors((prev) => ({ ...prev, reEmail: "Emails do not match!" }));
      hasError = true;
    }

    if (hasError) return;

    onSave();
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-4">Change Email</h3>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              New Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Re-enter Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Re-enter Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={reEmail}
              onChange={(e) => setReEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.reEmail ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.reEmail && <p className="text-red-500 text-sm mt-1">{errors.reEmail}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangeEmailModal;
