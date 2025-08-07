package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.LikeService;
import com.contoso.socialapp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikeController {
    
    private final LikeService likeService;
    private final PostService postService;
    
    @PostMapping
    public ResponseEntity<Object> likePost(@PathVariable String postId, @RequestBody LikeRequest request) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        return likeService.likePost(postId, request)
                .map(like -> ResponseEntity.status(HttpStatus.CREATED).body((Object) like))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("User already liked this post", 400)));
    }
    
    @DeleteMapping
    public ResponseEntity<?> unlikePost(@PathVariable String postId) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        likeService.unlikePost(postId);
        return ResponseEntity.noContent().build();
    }
}
