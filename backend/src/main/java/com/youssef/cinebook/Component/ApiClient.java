package com.youssef.cinebook.Component;

import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class ApiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ApiClient(HttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public <T> T fetchMoviesJson(String url,Class<T> res ){
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.
                    send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(),res);
            } else {
                System.out.println("Erreur HTTP : " + response.statusCode());
                return null;
            }
        } catch (Exception e) {
             throw new RuntimeException("Echec de la recup des donées via l'api !");
        }
    }

}