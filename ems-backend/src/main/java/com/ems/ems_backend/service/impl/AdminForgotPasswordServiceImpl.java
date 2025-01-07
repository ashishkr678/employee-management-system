package com.ems.ems_backend.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.OTPData;
import com.ems.ems_backend.entity.Admin;
import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.repository.AdminRepository;
import com.ems.ems_backend.service.AdminForgotPasswordService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminForgotPasswordServiceImpl implements AdminForgotPasswordService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, OTPData> otpStorage = new HashMap<>();

    @Override
    public void sendOtpForPasswordReset(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Username not found!"));

        int otp = new Random().nextInt(900000) + 100000;
        OTPData otpData = new OTPData(otp, null);
        otpStorage.put(username, otpData);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(admin.getEmail());
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP code is: " + otp + "\nThis OTP will expire in 15 minutes.");
        mailSender.send(message);
    }

    @Override
    public void verifyOtpForPasswordReset(String username, int otp) {
        OTPData otpData = otpStorage.get(username);

        if (otpData == null || otpData.isExpired()) {
            otpStorage.remove(username);
            throw new BadRequestException("OTP expired or not found. Please request a new OTP.");
        }

        if (otpData.getOtp() != otp) {
            throw new BadRequestException("Incorrect OTP. Please try again.");
        }

        otpData.setVerified(true);
    }

    @Override
    public void resetPassword(String username, String newPassword) {
        OTPData otpData = otpStorage.get(username);

        if (otpData == null || !otpData.isVerified()) {
            throw new BadRequestException("OTP verification required before resetting password!");
        }

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Username not found!"));

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);

        otpStorage.remove(username);
    }

}