package com.ems.ems_backend.controller;

import com.ems.ems_backend.service.AdminForgotPasswordService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.ResourceNotFoundException;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/admin/forgot-password")
public class AdminForgotPasswordController {

    @Autowired
    private AdminForgotPasswordService forgotPasswordService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required!");
        }

        try {
            forgotPasswordService.sendOtpForPasswordReset(username);
            return ResponseEntity.ok("OTP sent successfully to your registered email.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Not Found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String username, @RequestBody Map<String, Integer> request) {
        int otp = request.get("otp");

        try {
            forgotPasswordService.verifyOtpForPasswordReset(username, otp);
            return ResponseEntity.ok("OTP verified successfully!");
        } catch (BadRequestException e) {
            return ResponseEntity.status(400).body("Bad Request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String username, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("New password is required!");
        }

        try {
            forgotPasswordService.resetPassword(username, newPassword);
            return ResponseEntity.ok("Password updated successfully!");
        } catch (BadRequestException e) {
            return ResponseEntity.status(400).body("Bad Request: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Not Found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

}
