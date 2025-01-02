package com.ems.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AdminDto {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String phone;
    private String password;
}
