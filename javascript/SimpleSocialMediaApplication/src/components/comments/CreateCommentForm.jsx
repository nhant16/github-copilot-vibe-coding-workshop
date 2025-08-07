import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';

const CreateCommentForm = ({ postId, onCommentCreated }) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError, setServerOnline } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !content.trim()) {
      handleError(new Error('Username and content are required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newComment = await apiService.createComment(postId, {
        username: username.trim(),
        content: content.trim(),
      });
      setServerOnline();
      setUsername('');
      setContent('');
      onCommentCreated?.(newComment);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-comment-form">
      <h4>Add a Comment</h4>
      
      <div className="form-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          disabled={isSubmitting}
          required
          className="comment-username-input"
        />
      </div>

      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          rows={3}
          disabled={isSubmitting}
          required
          className="comment-content-input"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || !username.trim() || !content.trim()}
        className="submit-comment-button"
      >
        {isSubmitting ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
};

export default CreateCommentForm;
