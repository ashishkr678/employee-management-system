package com.ems.ems_backend.security;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvConfig {
    private static Dotenv dotenv;

    static {
        dotenv = Dotenv.configure().load();
    }

    public static String get(String key) {
        return dotenv.get(key);
    }

    public static void loadSystemProperties() {
        System.setProperty("DB_URL", get("DB_URL"));
        System.setProperty("DB_NAME", get("DB_NAME"));
        System.setProperty("MAIL_URL", get("MAIL_URL"));
        System.setProperty("MAIL_PORT", get("MAIL_PORT"));
        System.setProperty("MAIL_USERNAME", get("MAIL_USERNAME"));
        System.setProperty("MAIL_PASSWORD", get("MAIL_PASSWORD"));
    }
}
