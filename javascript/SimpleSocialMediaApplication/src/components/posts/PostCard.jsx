import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';
import CommentsList from '../comments/CommentsList';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(post.username);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeUsername, setLikeUsername] = useState('');
  const { handleError, setServerOnline } = useApp();

  const handleEdit = () => {
    setIsEditing(true);
    setEditUsername(post.username);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditUsername(post.username);
    setEditContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editUsername.trim() || !editContent.trim()) {
      handleError(new Error('Username and content are required'));
      return;
    }

    setIsUpdating(true);
    try {
      const updatedPost = await apiService.updatePost(post.id, {
        username: editUsername.trim(),
        content: editContent.trim(),
      });
      setServerOnline();
      setIsEditing(false);
      onPostUpdated?.(updatedPost);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deletePost(post.id);
      setServerOnline();
      onPostDeleted?.(post.id);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!likeUsername.trim()) {
      handleError(new Error('Username is required to like a post'));
      return;
    }

    setIsLiking(true);
    try {
      await apiService.likePost(post.id, { username: likeUsername.trim() });
      setServerOnline();
      setLikeUsername('');
      // Refresh the post to get updated like count
      const updatedPost = await apiService.getPost(post.id);
      onPostUpdated?.(updatedPost);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleUnlike = async () => {
    setIsLiking(true);
    try {
      await apiService.unlikePost(post.id);
      setServerOnline();
      // Refresh the post to get updated like count
      const updatedPost = await apiService.getPost(post.id);
      onPostUpdated?.(updatedPost);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="post-card">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-post-form">
          <div className="form-group">
            <label htmlFor={`edit-username-${post.id}`}>Username:</label>
            <input
              type="text"
              id={`edit-username-${post.id}`}
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`edit-content-${post.id}`}>Content:</label>
            <textarea
              id={`edit-content-${post.id}`}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isUpdating} className="save-button">
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleCancelEdit} disabled={isUpdating} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="post-header">
            <div className="post-meta">
              <span className="username">@{post.username}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
              {post.updatedAt !== post.createdAt && (
                <span className="updated">(edited {formatDate(post.updatedAt)})</span>
              )}
            </div>
            <div className="post-actions">
              <button onClick={handleEdit} className="edit-button" title="Edit post">
                ✏️
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting} 
                className="delete-button"
                title="Delete post"
              >
                {isDeleting ? '⏳' : '🗑️'}
              </button>
            </div>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          <div className="post-stats">
            <span className="likes-count">❤️ {post.likesCount} likes</span>
            <span className="comments-count">💬 {post.commentsCount} comments</span>
          </div>

          <div className="post-interactions">
            <div className="like-section">
              <input
                type="text"
                placeholder="Your username"
                value={likeUsername}
                onChange={(e) => setLikeUsername(e.target.value)}
                className="like-username-input"
              />
              <button 
                onClick={handleLike} 
                disabled={isLiking || !likeUsername.trim()}
                className="like-button"
              >
                {isLiking ? '⏳' : '❤️'} Like
              </button>
              <button 
                onClick={handleUnlike} 
                disabled={isLiking}
                className="unlike-button"
              >
                {isLiking ? '⏳' : '💔'} Unlike
              </button>
            </div>

            <button 
              onClick={() => setShowComments(!showComments)}
              className="toggle-comments-button"
            >
              {showComments ? 'Hide' : 'Show'} Comments
            </button>
          </div>

          {showComments && (
            <CommentsList 
              postId={post.id} 
              onCommentsUpdated={() => {
                // Refresh the post to get updated comment count
                apiService.getPost(post.id).then(onPostUpdated).catch(handleError);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostCard;
