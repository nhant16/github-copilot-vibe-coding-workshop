import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';
import PostCard from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';

const PostsList = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, setServerOnline, setServerOffline } = useApp();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await apiService.getPosts();
      setPosts(fetchedPosts || []);
      setServerOnline();
    } catch (error) {
      handleError(error);
      setServerOffline();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(prevPosts => 
      prevPosts.filter(post => post.id !== deletedPostId)
    );
  };

  if (isLoading) {
    return (
      <div className="posts-loading">
        <LoadingSpinner size="large" />
        <p>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No posts available. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      <h2>Recent Posts</h2>
      <div className="posts-container">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default PostsList;
