package com.ems.ems_backend.service;

public interface AdminEmailUpdateService {
    
    void sendOtpAndUpdateEmail(String username, String newEmail);

    void verifyOtpAndUpdateEmail(String username, int otp); 

}
