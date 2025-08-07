package com.contoso.socialapp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "Application is running!";
    }
    
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the Social Media API!";
    }
}
