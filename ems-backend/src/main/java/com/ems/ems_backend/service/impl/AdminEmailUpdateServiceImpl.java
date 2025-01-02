package com.ems.ems_backend.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.OTPData;
import com.ems.ems_backend.entity.Admin;
import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UnauthorizedException;
import com.ems.ems_backend.repository.AdminRepository;
import com.ems.ems_backend.service.AdminEmailUpdateService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminEmailUpdateServiceImpl implements AdminEmailUpdateService{

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, OTPData> otpStorage = new HashMap<>();

    @Override
    public void sendOtpAndUpdateEmail(String username, String newEmail) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedInUser = (User) authentication.getPrincipal();
        String loggedInUsername = loggedInUser.getUsername();

        if (!loggedInUsername.equals(username)) {
            throw new UnauthorizedException("You can only update your own email address.");
        }

        int otp = new Random().nextInt(900000) + 100000;

        OTPData otpData = new OTPData(otp, newEmail);
        otpStorage.put(username, otpData);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(newEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is:  " + otp + "\nOTP will be expired in 15 minutes.");
        mailSender.send(message);
    }

    @Override
    public void verifyOtpAndUpdateEmail(String username, int otp) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedInUser = (User) authentication.getPrincipal();
        String loggedInUsername = loggedInUser.getUsername();

        if (!loggedInUsername.equals(username)) {
            throw new UnauthorizedException("You can only update your own email address.");
        }

        OTPData otpData = otpStorage.get(username);
        if (otpData == null || otpData.isExpired()) {
            otpStorage.remove(username);
            throw new BadRequestException("OTP Expired. Request a new OTP.");
        }

        if (otpData.getOtp() != otp) {
            throw new BadRequestException("Incorrect OTP. Please try again.");
        }

        otpStorage.remove(username);

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        admin.setEmail(otpData.getNewEmail());
        adminRepository.save(admin);
    }
}
