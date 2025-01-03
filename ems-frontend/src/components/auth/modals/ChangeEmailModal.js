import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ChangeEmailModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newEmail, setNewEmail] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setReEmail("");
      setErrors({});
      setOtpModalOpen(false);
      setOtp(["", "", "", "", "", ""]);
      setNewEmail("");
      setTimer(120);
      setCanResend(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (otpModalOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup on unmount or timer change
    }
    if (timer === 0) {
      setCanResend(true); // Allow resend after timer reaches 0
    }
  }, [otpModalOpen, timer]);

  const handleSendOtp = async () => {
    setErrors({});
    let hasError = false;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailPattern.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format!" }));
      hasError = true;
    }
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

    try {
      await axios.post(
        "http://localhost:8080/api/admin/update-email/send-otp",
        { newEmail: email },
        { withCredentials: true }
      );

      toast.success("OTP Sent Successfully...");
      setNewEmail(email);
      setOtpModalOpen(true);
      setTimer(120); // Reset timer
      setCanResend(false); // Disable resend initially
    } catch (error) {
      const errorMessage =
        error.response?.data || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrors({ otp: "Please enter a 6-digit OTP!" });
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/admin/update-email/verify-otp",
        { otp: parseInt(otpValue, 10) },
        { withCredentials: true }
      );

      toast.success("Email updated successfully!");
      setOtpModalOpen(false);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data || "Failed to verify OTP. Please try again.";
      setErrors({ otp: errorMessage });
    }
  };

  const handleCancel = () => {
    setOtpModalOpen(false);
    onClose();
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setCanResend(false); // Disable resend immediately
      setTimer(120); // Reset the timer to 2 minutes
      await handleSendOtp(); // Send the OTP again
    }
  };

  return (
    <>
      {/* Main Modal */}
      {isOpen && !otpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
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
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
              {errors.reEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.reEmail}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-center mb-4">Verify OTP</h3>
            <p className="text-center mb-4 text-gray-600">
              A 6-digit OTP is sent to {newEmail}
            </p>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm text-center mb-4">{errors.otp}</p>
            )}

            {/* Timer and Resend Button */}
            <div className="text-center mb-4">
              {timer > 0 ? (
                <p className="text-gray-600 text-sm">
                  Resend OTP in {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-500 text-sm"
                  disabled={!canResend}
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeEmailModal;
