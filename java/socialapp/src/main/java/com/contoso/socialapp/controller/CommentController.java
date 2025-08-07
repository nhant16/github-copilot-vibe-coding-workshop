package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.CommentService;
import com.contoso.socialapp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    
    private final CommentService commentService;
    private final PostService postService;
    
    @GetMapping
    public ResponseEntity<?> listComments(@PathVariable String postId) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping
    public ResponseEntity<?> createComment(@PathVariable String postId, @RequestBody CreateCommentRequest request) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        CommentResponse createdComment = commentService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }
    
    @GetMapping("/{commentId}")
    public ResponseEntity<Object> getComment(@PathVariable String postId, @PathVariable String commentId) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        return commentService.getCommentById(postId, commentId)
                .map(comment -> ResponseEntity.ok((Object) comment))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Post or comment not found", 404)));
    }
    
    @PatchMapping("/{commentId}")
    public ResponseEntity<Object> updateComment(@PathVariable String postId, @PathVariable String commentId, 
                                         @RequestBody UpdateCommentRequest request) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        return commentService.updateComment(postId, commentId, request)
                .map(comment -> ResponseEntity.ok((Object) comment))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Post or comment not found", 404)));
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        // First check if post exists
        if (!postService.postExists(postId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
        
        boolean deleted = commentService.deleteComment(postId, commentId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post or comment not found", 404));
        }
    }
}
