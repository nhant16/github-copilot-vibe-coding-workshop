package com.contoso.socialapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
    private String id;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likesCount;
    private int commentsCount;
}
