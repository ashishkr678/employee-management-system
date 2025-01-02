package com.ems.ems_backend.dto;

import java.time.LocalDateTime;

public class OTPData {
    private int otp;
    private String newEmail;
    private boolean verified;
    private LocalDateTime timestamp;

    public OTPData(int otp, String newEmail) {
        this.otp = otp;
        this.newEmail = newEmail;
        this.timestamp = LocalDateTime.now();
    }

    public int getOtp() {
        return otp;
    }

    public void setOtp(int otp) {
        this.otp = otp;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isExpired() {
        return timestamp.plusMinutes(15).isBefore(LocalDateTime.now());
    }
}
