package com.ems.ems_backend.service;

import com.ems.ems_backend.dto.AdminDto;

public interface AdminService {
    void registerAdmin(AdminDto adminDto);

    String loginAdmin(String username, String password);
    
    AdminDto getAdminByUsername(String username);

    void changePassword(String username, String currentPassword, String newPassword);

    void updatePhoneNumber(String username, String newPhoneNumber);

}
