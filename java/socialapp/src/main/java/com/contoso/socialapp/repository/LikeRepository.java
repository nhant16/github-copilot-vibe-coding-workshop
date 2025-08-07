package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, String> {
    
    List<Like> findByPostId(String postId);
    
    Optional<Like> findByPostIdAndUsername(String postId, String username);
    
    void deleteByPostId(String postId);
}
