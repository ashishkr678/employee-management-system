package com.ems.ems_backend.controller;

import java.util.HashMap;
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
            Map<String, String> response = new HashMap<>();
            response.put("error", "Bad Request");
            response.put("message", "New email is required!");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            adminService.sendOtpAndUpdateEmail(request, newEmail);
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent successfully to " + newEmail + ". Please verify to update email.");
            return ResponseEntity.ok(response);
        } catch (UnauthorizedException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unauthorized");
            response.put("message", e.getMessage());
            return ResponseEntity.status(403).body(response);
        } catch (ResourceNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Not Found");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (BadRequestException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Bad Request");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(HttpServletRequest request, @RequestBody Map<String, Object> requestBody) {
        int otp = (int) requestBody.get("otp");

        try {
            adminService.verifyOtpAndUpdateEmail(request, otp);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email updated successfully!");
            return ResponseEntity.ok(response);
        } catch (UnauthorizedException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unauthorized");
            response.put("message", e.getMessage());
            return ResponseEntity.status(403).body(response);
        } catch (BadRequestException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Bad Request");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (ResourceNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Not Found");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
