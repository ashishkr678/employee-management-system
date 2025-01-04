import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [otpSent, setOtpSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2) {
      document.getElementById("otp-0").focus();
    }
  }, [step]);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setCanResend(true);
    }
  }, [otpSent, timer]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (errors.otp) {
      setErrors((prevErrors) => ({ ...prevErrors, otp: "" }));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSendOtp = async () => {
    setErrors({});
    if (!username.trim()) {
      setErrors({ username: "Username is required!" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/admin/forgot-password/send-otp",
        { username }
      );
      toast.success("OTP sent successfully to your registered email.");
      setStep(2);
      setOtpSent(true);
      setTimer(120);
    } catch (error) {
      if (error.response?.status === 404) {
        setErrors({ username: "Username not found." });
      } else {
        toast.error(
          error.response?.data?.error || "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrors({ otp: "Please enter a 6-digit OTP!" });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await axios.post(
        `http://localhost:8080/api/admin/forgot-password/verify-otp?username=${username}`,
        { otp: parseInt(otpValue, 10) }
      );
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors({
          otp:
            error.response?.data?.message || "Incorrect OTP. Please try again.",
        });
      } else {
        toast.error(
          error.response?.data?.error ||
            "Failed to verify OTP. Please try again."
        );
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setIsResending(true);
      setOtp(["", "", "", "", "", ""]);
      setErrors((prev) => ({ ...prev, otp: null }));

      try {
        await handleSendOtp();
        setTimer(120);
        setCanResend(false);
      } catch (error) {
        toast.error("Failed to resend OTP. Please try again.");
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, newPassword: "" }));
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
  };
  
  const handleResetPassword = async () => {
    setErrors({});
    
    if (!newPassword.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: "New password is required!" }));
      return;
    }
  
    if (!confirmPassword.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Confirm password is required!" }));
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords do not match!" }));
      return;
    }
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: "Password must contain at least 8 characters, including uppercase, lowercase, a digit, and a special character.",
      }));
      return;
    }
  
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/admin/forgot-password/reset-password?username=${username}`,
        { newPassword }
      );
      toast.success("Password updated successfully!");
      setStep(1);
      setUsername("");
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {step === 1 && "Forgot Password"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Reset Password"}
      </h2>

      {step === 1 && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className={`mt-4 w-full py-2 text-white rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-gray-600 text-center mb-4">
            Enter the 6-digit OTP sent to your registered email.
          </p>
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
                className="w-10 h-10 text-center border rounded-md focus:ring-2"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm text-center mb-2">
              {errors.otp}
            </p>
          )}

          <div className="text-center mb-2">
            {timer > 0 ? (
              <p className="text-gray-300 text-sm">
                Resend OTP in {Math.floor(timer / 60)}:
                {("0" + (timer % 60)).slice(-2)}
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className={`text-gray-500 text-sm ${
                  isResending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isResending}
              >
                {isResending ? "Resending OTP..." : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isVerifyingOtp || loading}
            className={`mt-4 w-full py-2 text-white rounded-lg ${
              isVerifyingOtp || loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className={`mt-4 w-full py-2 text-white rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
