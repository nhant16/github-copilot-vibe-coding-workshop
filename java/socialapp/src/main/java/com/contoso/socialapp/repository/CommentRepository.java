package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
    
    Optional<Comment> findByIdAndPostId(String commentId, String postId);
}
