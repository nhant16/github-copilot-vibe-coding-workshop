import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';
import CommentCard from './CommentCard';
import CreateCommentForm from './CreateCommentForm';
import LoadingSpinner from '../common/LoadingSpinner';

const CommentsList = ({ postId, onCommentsUpdated }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, setServerOnline } = useApp();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await apiService.getComments(postId);
      setComments(fetchedComments || []);
      setServerOnline();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentCreated = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    onCommentsUpdated?.();
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    onCommentsUpdated?.();
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== deletedCommentId)
    );
    onCommentsUpdated?.();
  };

  if (isLoading) {
    return (
      <div className="comments-loading">
        <LoadingSpinner size="small" />
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <CreateCommentForm 
        postId={postId} 
        onCommentCreated={handleCommentCreated}
      />

      {comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
