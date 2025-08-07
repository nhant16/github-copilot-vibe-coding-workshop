package com.contoso.socialapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Simple Social Media Application API")
                        .description("A basic but functional Social Networking Service (SNS) that allows users to create, retrieve, update, and delete posts; add comments; and like/unlike posts.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Product Owner / Tech Lead at Contoso")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development server")
                ));
    }
}
