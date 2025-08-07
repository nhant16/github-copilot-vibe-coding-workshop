package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.entity.Post;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    public Optional<PostResponse> getPostById(String postId) {
        return postRepository.findById(postId)
                .map(this::convertToResponse);
    }
    
    public PostResponse createPost(CreatePostRequest request) {
        Post post = new Post();
        post.setUsername(request.getUsername());
        post.setContent(request.getContent());
        
        Post savedPost = postRepository.save(post);
        return convertToResponse(savedPost);
    }
    
    public Optional<PostResponse> updatePost(String postId, UpdatePostRequest request) {
        return postRepository.findById(postId)
                .map(post -> {
                    post.setUsername(request.getUsername());
                    post.setContent(request.getContent());
                    Post savedPost = postRepository.save(post);
                    return convertToResponse(savedPost);
                });
    }
    
    public boolean deletePost(String postId) {
        return postRepository.findById(postId)
                .map(post -> {
                    postRepository.delete(post);
                    return true;
                })
                .orElse(false);
    }
    
    public boolean postExists(String postId) {
        return postRepository.existsById(postId);
    }
    
    private PostResponse convertToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .username(post.getUsername())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .build();
    }
}
