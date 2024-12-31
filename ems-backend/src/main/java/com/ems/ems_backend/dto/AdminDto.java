package com.ems.ems_backend.dto;

import lombok.Data;

@Data
public class AdminDto {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String phone;
    private String password;
}
