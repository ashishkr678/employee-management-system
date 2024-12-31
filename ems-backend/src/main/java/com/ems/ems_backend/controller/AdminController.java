package com.ems.ems_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.AdminDto;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UsernameAlreadyExistsException;
import com.ems.ems_backend.service.AdminService;

import lombok.AllArgsConstructor;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminDto adminDto) {
        try {
            adminService.registerAdmin(adminDto);
            return ResponseEntity.ok("Admin registered successfully!");
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminDto adminDto) {
        try {
            String token = adminService.loginAdmin(adminDto.getUsername(), adminDto.getPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successfull");
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal Server Error");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);

        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getAdminByUsername(@PathVariable String username) {
        try {
            AdminDto adminDto = adminService.getAdminByUsername(username);
            return ResponseEntity.ok(adminDto);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Admin not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("New password cannot be empty!");
            }

            adminService.changePassword(username, currentPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhoneNumber(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String newPhoneNumber = request.get("newPhoneNumber");

            if (newPhoneNumber == null || newPhoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("New phone number cannot be empty!");
            }

            adminService.updatePhoneNumber(username, newPhoneNumber);
            return ResponseEntity.ok("Phone number updated successfully!");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

}
