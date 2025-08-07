import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';

const CreatePostForm = ({ onPostCreated }) => {
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
      const newPost = await apiService.createPost({
        username: username.trim(),
        content: content.trim(),
      });
      setServerOnline();
      setUsername('');
      setContent('');
      onPostCreated?.(newPost);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2>Create New Post</h2>
      
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          disabled={isSubmitting}
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || !username.trim() || !content.trim()}
        className="submit-button"
      >
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePostForm;
