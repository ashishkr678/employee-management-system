package com.ems.ems_backend.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.AdminDto;
import com.ems.ems_backend.entity.Admin;
import com.ems.ems_backend.exception.EmailAlreadyExistsException;
import com.ems.ems_backend.exception.ResourceNotFoundException;
import com.ems.ems_backend.exception.UsernameAlreadyExistsException;
import com.ems.ems_backend.jwt.JwtUtil;
import com.ems.ems_backend.repository.AdminRepository;
import com.ems.ems_backend.security.DotenvConfig;
import com.ems.ems_backend.service.AdminService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
                throw new UsernameAlreadyExistsException("Username already exists!");
            }

            Optional<Admin> existingAdminByEmail = adminRepository.findByEmail(adminDto.getEmail());
            if (existingAdminByEmail.isPresent()) {
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
    public void loginAdmin(String username, String password, HttpServletResponse response) {
        try {
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password!"));

            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new IllegalArgumentException("Invalid username or password!");
            }

            String token = jwtUtil.generateToken(admin.getUsername());

            Cookie jwtCookie = new Cookie("jwt", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(10 * 60 * 60);

            boolean isProduction = System.getenv("PROFILES_ACTIVE").equals("prod");
            jwtCookie.setSecure(isProduction);

            String sameSite = isProduction ? "None" : "Lax";
            response.addHeader("Set-Cookie", createCookieWithSameSite(jwtCookie, sameSite));

            Cookie usernameCookie = new Cookie("username", admin.getUsername());
            usernameCookie.setHttpOnly(false);
            usernameCookie.setPath("/");
            usernameCookie.setMaxAge(10 * 60 * 60);

            usernameCookie.setSecure(isProduction);

            response.addHeader("Set-Cookie", createCookieWithSameSite(usernameCookie, sameSite));

        } catch (ResourceNotFoundException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }

    private String createCookieWithSameSite(Cookie cookie, String sameSite) {
        StringBuilder cookieBuilder = new StringBuilder();

        cookieBuilder.append(cookie.getName()).append("=").append(cookie.getValue()).append(";");
        cookieBuilder.append(" Path=").append(cookie.getPath()).append(";");
        cookieBuilder.append(" Max-Age=").append(cookie.getMaxAge()).append(";");
        if (cookie.getSecure()) {
            cookieBuilder.append(" Secure;");
        }
        if (cookie.isHttpOnly()) {
            cookieBuilder.append(" HttpOnly;");
        }
        cookieBuilder.append(" SameSite=").append(sameSite).append(";");

        return cookieBuilder.toString();
    }

    @Override
    public AdminDto getAdminProfile(HttpServletRequest request) {
        String username = extractUsernameFromCookie(request);
        if (username == null) {
            throw new IllegalArgumentException("No username found.");
        }

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        AdminDto adminDto = new AdminDto();
        adminDto.setFirstName(admin.getFirstName());
        adminDto.setLastName(admin.getLastName());
        adminDto.setUsername(admin.getUsername());
        adminDto.setEmail(admin.getEmail());
        adminDto.setPhone(admin.getPhone());

        return adminDto;
    }

    @Override
    public void changePassword(HttpServletRequest request, String currentPassword, String newPassword) {
        String username = extractUsernameFromCookie(request);
        if (username == null) {
            throw new IllegalArgumentException("No username found!");
        }

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect!");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }

    @Override
    public void updatePhoneNumber(HttpServletRequest request, String newPhoneNumber) {
        String username = extractUsernameFromCookie(request);
        if (username == null) {
            throw new IllegalArgumentException("No username found.");
        }

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));

        if (newPhoneNumber == null || newPhoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty!");
        }

        admin.setPhone(newPhoneNumber);
        adminRepository.save(admin);
    }

    private String extractUsernameFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("username")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @Override
    public void logout(HttpServletResponse response) {
        try {
            boolean isProduction = System.getenv("PROFILES_ACTIVE").equals("prod");

            Cookie jwtCookie = new Cookie("jwt", null);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setPath("/");
            jwtCookie.setSecure(isProduction);
            jwtCookie.setMaxAge(0);
            response.addHeader("Set-Cookie", createCookieWithSameSite(jwtCookie, isProduction ? "None" : "Lax"));

            Cookie usernameCookie = new Cookie("username", null);
            usernameCookie.setHttpOnly(false);
            usernameCookie.setPath("/");
            usernameCookie.setSecure(isProduction);
            usernameCookie.setMaxAge(0);
            response.addHeader("Set-Cookie", createCookieWithSameSite(usernameCookie, isProduction ? "None" : "Lax"));
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while logging out: " + e.getMessage(), e);
        }
    }

}