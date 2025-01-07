package com.ems.ems_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.AdminDto;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UsernameAlreadyExistsException;
import com.ems.ems_backend.service.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Build Register Admin REST API
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminDto adminDto) {
        try {
            adminService.registerAdmin(adminDto);
            return ResponseEntity.ok(Map.of("message", "Admin registered successfully."));
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }

    // Build Login Admin REST API
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminDto adminDto, HttpServletResponse response) {
        try {
            adminService.loginAdmin(adminDto.getUsername(), adminDto.getPassword(), response);
            return ResponseEntity.ok(Map.of("message", "Login successful."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Server Error",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Unexpected Error",
                    "message", e.getMessage()));
        }
    }

    // Build Get Admin Profile REST API
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            AdminDto adminDto = adminService.getAdminProfile(request);
            return ResponseEntity.ok(adminDto);
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

    // Build Admin Change Password REST API
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                            "error", "Bad Request",
                            "message", "New password cannot be empty!"));
            }

            adminService.changePassword(httpServletRequest, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error", "message", e.getMessage()));
        }
    }

    // Build Admin Change Phone Number REST API
    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhoneNumber(@RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {
        try {
            String newPhoneNumber = request.get("newPhoneNumber");

            if (newPhoneNumber == null || newPhoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                            "error", "Bad Request",
                            "message", "New phone number cannot be empty!"));
            }

            adminService.updatePhoneNumber(httpServletRequest, newPhoneNumber);
            return ResponseEntity.ok(Map.of("message", "Phone number updated successfully."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "Not Found",
                    "message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }

    // Build Logout Admin REST API
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            adminService.logout(response);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error",
                    "message", e.getMessage()));
        }
    }

    // Build Check Admin Authentication Status REST API
    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("message", "Authenticated"));
        }
        return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "User is not authenticated."));
    }
}