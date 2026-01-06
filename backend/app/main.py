"""
DAB-Form Backend API
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Router importieren
from app.api import benutzer, auth, patient, bericht

# App erstellen
app = FastAPI(
    title="DAB-Form API",
    description="Digitales Durchgangsarzt-Berichtsystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router einbinden
app.include_router(benutzer.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(bericht.router)
# Root Endpoint
@app.get("/")
def root():
    """Root Endpoint - API Status"""
    return {
        "message": "DAB-Form API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health Check
@app.get("/health")
def health():
    """Health Check Endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }
