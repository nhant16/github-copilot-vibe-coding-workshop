"""Simple Social Media Application API using FastAPI."""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

# Import our models and schemas
from models import Post as PostModel, Comment as CommentModel, Like as LikeModel
from models import create_tables, get_db
from schemas import (
    Post, Comment, Like, Error,
    CreatePostRequest, UpdatePostRequest,
    CreateCommentRequest, UpdateCommentRequest,
    LikeRequest
)

# Initialize FastAPI app
app = FastAPI(
    title="Simple Social Media Application API",
    description="A basic but functional Social Networking Service (SNS) that allows users to create, retrieve, update, and delete posts; add comments; and like/unlike posts.",
    version="1.0.0",
    contact={"name": "Product Owner / Tech Lead at Contoso"}
)

# Configure CORS to allow from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    create_tables()


# Helper functions
def convert_post_to_api(post: PostModel) -> Post:
    """Convert database Post model to API Post response."""
    return Post(
        id=post.id,
        username=post.username,
        content=post.content,
        createdAt=post.created_at,
        updatedAt=post.updated_at,
        likesCount=post.likes_count,
        commentsCount=post.comments_count
    )


def convert_comment_to_api(comment: CommentModel) -> Comment:
    """Convert database Comment model to API Comment response."""
    return Comment(
        id=comment.id,
        postId=comment.post_id,
        username=comment.username,
        content=comment.content,
        createdAt=comment.created_at,
        updatedAt=comment.updated_at
    )


def convert_like_to_api(like: LikeModel) -> Like:
    """Convert database Like model to API Like response."""
    return Like(
        id=like.id,
        postId=like.post_id,
        username=like.username,
        createdAt=like.created_at
    )


def get_post_or_404(db: Session, post_id: str) -> PostModel:
    """Get post by ID or raise 404."""
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Post not found", "code": 404}
        )
    return post


def get_comment_or_404(db: Session, post_id: str, comment_id: str) -> CommentModel:
    """Get comment by ID or raise 404."""
    # First check if post exists
    get_post_or_404(db, post_id)
    
    comment = db.query(CommentModel).filter(
        CommentModel.id == comment_id,
        CommentModel.post_id == post_id
    ).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Post or comment not found", "code": 404}
        )
    return comment


# Post endpoints
@app.get("/api/posts", response_model=List[Post], tags=["Posts"])
def list_posts(db: Session = Depends(get_db)):
    """List all posts."""
    posts = db.query(PostModel).all()
    return [convert_post_to_api(post) for post in posts]


@app.post("/api/posts", response_model=Post, status_code=status.HTTP_201_CREATED, tags=["Posts"])
def create_post(post_data: CreatePostRequest, db: Session = Depends(get_db)):
    """Create a new post."""
    post = PostModel(
        username=post_data.username,
        content=post_data.content
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return convert_post_to_api(post)


@app.get("/api/posts/{post_id}", response_model=Post, tags=["Posts"])
def get_post(post_id: str, db: Session = Depends(get_db)):
    """Get a specific post."""
    post = get_post_or_404(db, post_id)
    return convert_post_to_api(post)


@app.patch("/api/posts/{post_id}", response_model=Post, tags=["Posts"])
def update_post(post_id: str, post_data: UpdatePostRequest, db: Session = Depends(get_db)):
    """Update a post."""
    post = get_post_or_404(db, post_id)
    post.username = post_data.username
    post.content = post_data.content
    db.commit()
    db.refresh(post)
    return convert_post_to_api(post)


@app.delete("/api/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Posts"])
def delete_post(post_id: str, db: Session = Depends(get_db)):
    """Delete a post."""
    post = get_post_or_404(db, post_id)
    db.delete(post)
    db.commit()


# Comment endpoints
@app.get("/api/posts/{post_id}/comments", response_model=List[Comment], tags=["Comments"])
def list_comments(post_id: str, db: Session = Depends(get_db)):
    """List comments for a post."""
    # First check if post exists
    get_post_or_404(db, post_id)
    
    comments = db.query(CommentModel).filter(CommentModel.post_id == post_id).all()
    return [convert_comment_to_api(comment) for comment in comments]


@app.post("/api/posts/{post_id}/comments", response_model=Comment, status_code=status.HTTP_201_CREATED, tags=["Comments"])
def create_comment(post_id: str, comment_data: CreateCommentRequest, db: Session = Depends(get_db)):
    """Create a comment."""
    # First check if post exists
    get_post_or_404(db, post_id)
    
    comment = CommentModel(
        post_id=post_id,
        username=comment_data.username,
        content=comment_data.content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return convert_comment_to_api(comment)


@app.get("/api/posts/{post_id}/comments/{comment_id}", response_model=Comment, tags=["Comments"])
def get_comment(post_id: str, comment_id: str, db: Session = Depends(get_db)):
    """Get a specific comment."""
    comment = get_comment_or_404(db, post_id, comment_id)
    return convert_comment_to_api(comment)


@app.patch("/api/posts/{post_id}/comments/{comment_id}", response_model=Comment, tags=["Comments"])
def update_comment(post_id: str, comment_id: str, comment_data: UpdateCommentRequest, db: Session = Depends(get_db)):
    """Update a comment."""
    comment = get_comment_or_404(db, post_id, comment_id)
    comment.username = comment_data.username
    comment.content = comment_data.content
    db.commit()
    db.refresh(comment)
    return convert_comment_to_api(comment)


@app.delete("/api/posts/{post_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Comments"])
def delete_comment(post_id: str, comment_id: str, db: Session = Depends(get_db)):
    """Delete a comment."""
    comment = get_comment_or_404(db, post_id, comment_id)
    db.delete(comment)
    db.commit()


# Like endpoints
@app.post("/api/posts/{post_id}/likes", response_model=Like, status_code=status.HTTP_201_CREATED, tags=["Likes"])
def like_post(post_id: str, like_data: LikeRequest, db: Session = Depends(get_db)):
    """Like a post."""
    # First check if post exists
    get_post_or_404(db, post_id)
    
    # Check if user already liked this post
    existing_like = db.query(LikeModel).filter(
        LikeModel.post_id == post_id,
        LikeModel.username == like_data.username
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "User already liked this post", "code": 400}
        )
    
    like = LikeModel(
        post_id=post_id,
        username=like_data.username
    )
    db.add(like)
    db.commit()
    db.refresh(like)
    return convert_like_to_api(like)


@app.delete("/api/posts/{post_id}/likes", status_code=status.HTTP_204_NO_CONTENT, tags=["Likes"])
def unlike_post(post_id: str, db: Session = Depends(get_db)):
    """Unlike a post."""
    # First check if post exists
    get_post_or_404(db, post_id)
    
    # For simplicity, we'll remove all likes for this post
    # In a real application, you'd want to identify the specific user
    likes = db.query(LikeModel).filter(LikeModel.post_id == post_id).all()
    for like in likes:
        db.delete(like)
    db.commit()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
