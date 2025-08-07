package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.entity.Comment;
import com.contoso.socialapp.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    
    public List<CommentResponse> getCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return comments.stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    public Optional<CommentResponse> getCommentById(String postId, String commentId) {
        return commentRepository.findByIdAndPostId(commentId, postId)
                .map(this::convertToResponse);
    }
    
    public CommentResponse createComment(String postId, CreateCommentRequest request) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUsername(request.getUsername());
        comment.setContent(request.getContent());
        
        Comment savedComment = commentRepository.save(comment);
        return convertToResponse(savedComment);
    }
    
    public Optional<CommentResponse> updateComment(String postId, String commentId, UpdateCommentRequest request) {
        return commentRepository.findByIdAndPostId(commentId, postId)
                .map(comment -> {
                    comment.setUsername(request.getUsername());
                    comment.setContent(request.getContent());
                    Comment savedComment = commentRepository.save(comment);
                    return convertToResponse(savedComment);
                });
    }
    
    public boolean deleteComment(String postId, String commentId) {
        return commentRepository.findByIdAndPostId(commentId, postId)
                .map(comment -> {
                    commentRepository.delete(comment);
                    return true;
                })
                .orElse(false);
    }
    
    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .username(comment.getUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
