package com.youssef.cinebook;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableCaching
@SpringBootApplication
public class CinebookBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinebookBackendApplication.class, args);
	}
}

