package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Posts", description = "Post management operations")
public class PostController {
    
    private final PostService postService;
    
    @GetMapping
    @Operation(summary = "List all posts", description = "Retrieve all recent posts for browsing")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved posts",
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = PostResponse.class)))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<PostResponse>> listPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping
    @Operation(summary = "Create a new post", description = "Create a new post to share with others")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Post created successfully",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = PostResponse.class))),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PostResponse> createPost(@RequestBody CreatePostRequest request) {
        PostResponse createdPost = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }
    
    @GetMapping("/{postId}")
    @Operation(summary = "Get a specific post", description = "Retrieve a specific post by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved post",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = PostResponse.class))),
        @ApiResponse(responseCode = "404", description = "Post not found",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Object> getPost(
            @Parameter(description = "The ID of the post to retrieve", required = true)
            @PathVariable String postId) {
        return postService.getPostById(postId)
                .map(post -> ResponseEntity.ok((Object) post))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Post not found", 404)));
    }
    
    @PatchMapping("/{postId}")
    @Operation(summary = "Update a post", description = "Update an existing post")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Post updated successfully",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = PostResponse.class))),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Post not found",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Object> updatePost(
            @Parameter(description = "The ID of the post to update", required = true)
            @PathVariable String postId, 
            @RequestBody UpdatePostRequest request) {
        return postService.updatePost(postId, request)
                .map(post -> ResponseEntity.ok((Object) post))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Post not found", 404)));
    }
    
    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a post", description = "Delete an existing post")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Post deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Post not found",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<?> deletePost(
            @Parameter(description = "The ID of the post to delete", required = true)
            @PathVariable String postId) {
        boolean deleted = postService.deletePost(postId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Post not found", 404));
        }
    }
}
