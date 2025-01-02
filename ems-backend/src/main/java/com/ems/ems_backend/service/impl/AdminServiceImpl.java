package com.ems.ems_backend.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

import com.ems.ems_backend.dto.AdminDto;
import com.ems.ems_backend.dto.OTPData;
import com.ems.ems_backend.entity.Admin;
import com.ems.ems_backend.exception.BadRequestException;
import com.ems.ems_backend.exception.EmailAlreadyExistsException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UnauthorizedException;
import com.ems.ems_backend.exception.UsernameAlreadyExistsException;
import com.ems.ems_backend.jwt.JwtUtil;
import com.ems.ems_backend.repository.AdminRepository;
import com.ems.ems_backend.service.AdminService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerAdmin(AdminDto adminDto) {
        try {
            Optional<Admin> existingAdminByUsername = adminRepository.findByUsername(adminDto.getUsername());
            if (existingAdminByUsername.isPresent()) {
                System.out.println("Admin with username already exists: " + adminDto.getUsername());
                throw new UsernameAlreadyExistsException("Username already exists!");
            }

            Optional<Admin> existingAdminByEmail = adminRepository.findByEmail(adminDto.getEmail());
            if (existingAdminByEmail.isPresent()) {
                System.out.println("Admin with email already exists: " + adminDto.getEmail());
                throw new EmailAlreadyExistsException("Email already exists!");
            }

            Admin admin = new Admin();
            admin.setFirstName(adminDto.getFirstName());
            admin.setLastName(adminDto.getLastName());
            admin.setUsername(adminDto.getUsername());
            admin.setEmail(adminDto.getEmail());
            admin.setPhone(adminDto.getPhone());
            admin.setPassword(passwordEncoder.encode(adminDto.getPassword()));

            adminRepository.save(admin);
        } catch (UsernameAlreadyExistsException e) {
            throw e;
        } catch (EmailAlreadyExistsException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error occurred during admin registration: " + e.getMessage());
        }
    }

    @Override
    public String loginAdmin(String username, String password) {
        try {
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password!"));

            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new IllegalArgumentException("Invalid username or password!");
            }

            return jwtUtil.generateToken(admin.getUsername());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public AdminDto getAdminByUsername(String username) {
        try {
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

            AdminDto adminDto = new AdminDto();
            adminDto.setFirstName(admin.getFirstName());
            adminDto.setLastName(admin.getLastName());
            adminDto.setUsername(admin.getUsername());
            adminDto.setEmail(admin.getEmail());
            adminDto.setPhone(admin.getPhone());

            return adminDto;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while retrieving admin data: " + e.getMessage());
        }
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect!");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }

    @Override
    public void updatePhoneNumber(String username, String newPhoneNumber) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        if (newPhoneNumber == null || newPhoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty!");
        }

        admin.setPhone(newPhoneNumber);
        adminRepository.save(admin);
    }

}
