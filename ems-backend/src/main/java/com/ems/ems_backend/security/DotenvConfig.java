package com.ems.ems_backend.security;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvConfig {
    private static Dotenv dotenv;

    static {
        dotenv = Dotenv.configure()
                .directory("ems-backend//.env")
                .load();
    }

    public static String get(String key) {
        return dotenv.get(key);
    }

    public static void loadSystemProperties() {
        System.setProperty("DATABASE_URL", get("DATABASE_URL"));
        System.setProperty("DATABASE_USERNAME", get("DATABASE_USERNAME"));
        System.setProperty("DATABASE_PASSWORD", get("DATABASE_PASSWORD"));
        System.setProperty("MAIL_PORT", get("MAIL_PORT"));
        System.setProperty("MAIL_USERNAME", get("MAIL_USERNAME"));
        System.setProperty("MAIL_PASSWORD", get("MAIL_PASSWORD"));
    }
}
