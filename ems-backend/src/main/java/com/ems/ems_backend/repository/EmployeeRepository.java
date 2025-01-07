package com.ems.ems_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ems.ems_backend.entity.Employee;

public interface EmployeeRepository extends MongoRepository<Employee, Long> {
    boolean existsByEmail(String email);
}
