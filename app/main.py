"""
DAB-Form Backend API
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# App erstellen
app = FastAPI(
    title="DAB-Form API",
    description="Digitales Durchgangsarzt-Berichtsystem",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc UI
)

# CORS Middleware (für Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
def root():
    """
    Root Endpoint - API Status
    """
    return {
        "message": "DAB-Form API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health Check
@app.get("/health")
def health():
    """
    Health Check Endpoint
    """
    return {
        "status": "healthy",
        "database": "not connected yet"
    }