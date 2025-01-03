package com.ems.ems_backend.service;

import com.ems.ems_backend.dto.AdminDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AdminService {
    void registerAdmin(AdminDto adminDto);

    void loginAdmin(String username, String password, HttpServletResponse response);
    
    AdminDto getAdminProfile(HttpServletRequest request);

    void changePassword(HttpServletRequest request, String currentPassword, String newPassword);

    void updatePhoneNumber(HttpServletRequest request, String newPhoneNumber);

    void logout(HttpServletResponse response);

    boolean checkAuth(HttpServletRequest request);

}
