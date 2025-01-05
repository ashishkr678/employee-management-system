package com.ems.ems_backend;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.ems.ems_backend.security.DotenvConfig;

@SpringBootTest
class EmsBackendApplicationTests {

	@BeforeAll
    static void setup() {
        DotenvConfig.loadSystemProperties();
    }

	@Test
	void contextLoads() {
	}

}
