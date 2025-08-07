"""Pydantic schemas matching the OpenAPI specification."""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

# Request schemas
class CreatePostRequest(BaseModel):
    """Schema for creating a new post."""
    username: str
    content: str


class UpdatePostRequest(BaseModel):
    """Schema for updating a post."""
    username: str
    content: str


class CreateCommentRequest(BaseModel):
    """Schema for creating a new comment."""
    username: str
    content: str


class UpdateCommentRequest(BaseModel):
    """Schema for updating a comment."""
    username: str
    content: str


class LikeRequest(BaseModel):
    """Schema for liking a post."""
    username: str


# Response schemas
class Post(BaseModel):
    """Post schema matching the OpenAPI specification."""
    id: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    likesCount: int
    commentsCount: int


class Comment(BaseModel):
    """Comment schema matching the OpenAPI specification."""
    id: str
    postId: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime


class Like(BaseModel):
    """Like schema matching the OpenAPI specification."""
    id: str
    postId: str
    username: str
    createdAt: datetime


class Error(BaseModel):
    """Error schema matching the OpenAPI specification."""
    message: str
    code: int
