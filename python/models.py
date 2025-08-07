"""Database models for the Simple Social Media Application."""

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class Post(Base):
    """Post model matching the OpenAPI schema."""
    __tablename__ = "posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    
    @property
    def likes_count(self) -> int:
        """Return the number of likes for this post."""
        return len(self.likes)
    
    @property
    def comments_count(self) -> int:
        """Return the number of comments for this post."""
        return len(self.comments)


class Comment(Base):
    """Comment model matching the OpenAPI schema."""
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String, ForeignKey("posts.id"), nullable=False)
    username = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    post = relationship("Post", back_populates="comments")


class Like(Base):
    """Like model matching the OpenAPI schema."""
    __tablename__ = "likes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String, ForeignKey("posts.id"), nullable=False)
    username = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    post = relationship("Post", back_populates="likes")


# Database setup
DATABASE_URL = "sqlite:///./sns_api.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
