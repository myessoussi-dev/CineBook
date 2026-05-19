package com.youssef.cinebook;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {

    private static final Dotenv dotenv = Dotenv.load();

    public static final String API_KEY = dotenv.get("API_KEY");
}