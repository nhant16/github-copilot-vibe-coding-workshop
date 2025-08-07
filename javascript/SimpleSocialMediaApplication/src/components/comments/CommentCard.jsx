import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';

const CommentCard = ({ comment, postId, onCommentUpdated, onCommentDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(comment.username);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleError, setServerOnline } = useApp();

  const handleEdit = () => {
    setIsEditing(true);
    setEditUsername(comment.username);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditUsername(comment.username);
    setEditContent(comment.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editUsername.trim() || !editContent.trim()) {
      handleError(new Error('Username and content are required'));
      return;
    }

    setIsUpdating(true);
    try {
      const updatedComment = await apiService.updateComment(postId, comment.id, {
        username: editUsername.trim(),
        content: editContent.trim(),
      });
      setServerOnline();
      setIsEditing(false);
      onCommentUpdated?.(updatedComment);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteComment(postId, comment.id);
      setServerOnline();
      onCommentDeleted?.(comment.id);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="comment-card">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-comment-form">
          <div className="form-group">
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="Username"
              disabled={isUpdating}
              required
              className="edit-username-input"
            />
          </div>
          <div className="form-group">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Comment content"
              rows={3}
              disabled={isUpdating}
              required
              className="edit-content-input"
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
          <div className="comment-header">
            <div className="comment-meta">
              <span className="username">@{comment.username}</span>
              <span className="date">{formatDate(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="updated">(edited {formatDate(comment.updatedAt)})</span>
              )}
            </div>
            <div className="comment-actions">
              <button onClick={handleEdit} className="edit-button" title="Edit comment">
                ✏️
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting} 
                className="delete-button"
                title="Delete comment"
              >
                {isDeleting ? '⏳' : '🗑️'}
              </button>
            </div>
          </div>

          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentCard;
