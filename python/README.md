# Python FastAPI Implementation

This is a FastAPI implementation of the Simple Social Media Application API.

## Setup

1. Create and activate virtual environment:
   ```bash
   uv venv .venv
   .venv\Scripts\activate  # Windows
   ```

2. Install dependencies:
   ```bash
   uv pip install fastapi uvicorn sqlalchemy python-multipart
   ```

## Running the Application

From the workspace root directory, activate the virtual environment and run:
```bash
python\.venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Documentationc

- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json
- ReDoc: http://localhost:8000/redoc
- ReDoc: http://localhost:8000/redoc

## Database

- Uses SQLite database: `sns_api.db` (created in workspace root)
- Database is automatically initialized on startup
- Tables are created based on SQLAlchemy models

## Features

- ✅ All 12 API endpoints from OpenAPI specification
- ✅ CORS enabled for all origins
- ✅ SQLite database with automatic initialization
- ✅ Swagger UI documentation
- ✅ OpenAPI JSON specification
- ✅ Input validation with Pydantic
- ✅ Proper HTTP status codes
- ✅ Error handling

## Files

- `main.py` - FastAPI application with all endpoints
- `models.py` - SQLAlchemy database models
- `schemas.py` - Pydantic schemas for request/response validation
