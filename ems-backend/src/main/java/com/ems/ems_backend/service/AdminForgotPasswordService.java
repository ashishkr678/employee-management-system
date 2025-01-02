package com.ems.ems_backend.service;

public interface  AdminForgotPasswordService {
    void sendOtpForPasswordReset(String username);

    void verifyOtpForPasswordReset(String username, int otp);

    void resetPassword(String username, String newPassword);
    
}
