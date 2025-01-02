package com.ems.ems_backend.service;

import jakarta.servlet.http.HttpServletRequest;

public interface AdminEmailUpdateService {
    
    void sendOtpAndUpdateEmail(HttpServletRequest request, String newEmail);

    public void verifyOtpAndUpdateEmail(HttpServletRequest request, int otp); 

}
