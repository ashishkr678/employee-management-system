package com.ems.ems_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ems.ems_backend.security.DotenvConfig;

@SpringBootApplication
public class EmsBackendApplication {
    public static void main(String[] args) {

		DotenvConfig.loadSystemProperties();

        SpringApplication.run(EmsBackendApplication.class, args);
		
    }
}
