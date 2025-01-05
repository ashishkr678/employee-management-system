package com.ems.ems_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.service.AdminForgotPasswordService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin/forgot-password")
public class AdminForgotPasswordController {

    @Autowired
    private AdminForgotPasswordService forgotPasswordService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required!"));
        }

        try {
            forgotPasswordService.sendOtpForPasswordReset(username);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to your registered email."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String username, @RequestBody Map<String, Integer> request) {
        int otp = request.get("otp");

        try {
            forgotPasswordService.verifyOtpForPasswordReset(username, otp);
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String username, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password is required!"));
        }

        try {
            forgotPasswordService.resetPassword(username, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }
}
