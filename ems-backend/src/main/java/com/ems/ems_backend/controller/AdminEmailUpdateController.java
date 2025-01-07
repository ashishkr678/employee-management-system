package com.ems.ems_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UnauthorizedException;
import com.ems.ems_backend.service.AdminEmailUpdateService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/admin/update-email")
public class AdminEmailUpdateController {

    @Autowired
    private AdminEmailUpdateService adminService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(HttpServletRequest request, @RequestBody Map<String, String> requestBody) {
        String newEmail = requestBody.get("newEmail");

        if (newEmail == null || newEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "New email is required!"));
        }

        try {
            adminService.sendOtpAndUpdateEmail(request, newEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent successfully to " + newEmail + ". Please verify to update email."));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Unauthorized",
                    "message", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", e.getMessage()));
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

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(HttpServletRequest request, @RequestBody Map<String, Object> requestBody) {
        int otp = (int) requestBody.get("otp");

        try {
            adminService.verifyOtpAndUpdateEmail(request, otp);
            return ResponseEntity.ok(Map.of(
                    "message", "Email updated successfully."));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Unauthorized",
                    "message", e.getMessage()));
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