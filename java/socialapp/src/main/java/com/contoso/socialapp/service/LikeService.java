package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.entity.Like;
import com.contoso.socialapp.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {
    
    private final LikeRepository likeRepository;
    
    public Optional<LikeResponse> likePost(String postId, LikeRequest request) {
        // Check if user already liked this post
        Optional<Like> existingLike = likeRepository.findByPostIdAndUsername(postId, request.getUsername());
        if (existingLike.isPresent()) {
            return Optional.empty(); // User already liked this post
        }
        
        Like like = new Like();
        like.setPostId(postId);
        like.setUsername(request.getUsername());
        
        Like savedLike = likeRepository.save(like);
        return Optional.of(convertToResponse(savedLike));
    }
    
    public boolean unlikePost(String postId) {
        // For simplicity, we'll remove all likes for this post
        // In a real application, you'd want to identify the specific user
        likeRepository.deleteByPostId(postId);
        return true;
    }
    
    private LikeResponse convertToResponse(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .postId(like.getPostId())
                .username(like.getUsername())
                .createdAt(like.getCreatedAt())
                .build();
    }
}
