import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import ChangeEmailModal from "../modals/ChangeEmailModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import ChangePhoneModal from "../modals/ChangePhoneModal";
import api from "../../../apiConfig/ApiConfig";

const Profile = () => {
  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/admin/profile");
      setAdmin(response.data);
    } catch (error) {
      toast.error("Failed to load profile data. Log in again!");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModalClose = () => {
    fetchAdminData();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-300 to-pink-200 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Admin Profile
        </h2>
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              value={admin.firstName || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={admin.lastName || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={admin.username || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <div className="flex items-center relative">
              <input
                type="email"
                value={admin.email || ""}
                readOnly
                className="flex-grow px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
              />
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaEdit size={20} />
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone
            </label>
            <div className="flex items-center relative">
              <input
                type="text"
                value={admin.phone || ""}
                readOnly
                className="flex-grow px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
              />
              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaEdit size={20} />
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <div className="flex items-center relative">
              <input
                type="password"
                value="********"
                readOnly
                className="flex-grow px-4 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none"
              />
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="absolute right-14 top-1/2 transform translate-x-12 -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaEdit size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangeEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          handleModalClose();
        }}
      />
      <ChangePhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => {
          setIsPhoneModalOpen(false);
          handleModalClose();
        }}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          handleModalClose();
        }}
      />
    </div>
  );
};

export default Profile;
