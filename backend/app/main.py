"""
DAB-Form Backend API
FastAPI Application Entry Point
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Router importieren
from app.api import benutzer, auth, patient, bericht
from app.api import icd
from app.api.krankenkasse import router as krankenkasse_router
from app.api.unfallbetrieb import router as unfallbetrieb_router
from app.api.uv_traeger import router as uv_traeger_router
from app.api.pdf import router as pdf_router

# App erstellen
app = FastAPI(
    title="DAB-Form API",
    description="Digitales Durchgangsarzt-Berichtsystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://dabform.vercel.app/",
]

# optional: Prod-Frontend Domain aus ENV erlauben (z.B. https://deinprojekt.vercel.app)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Router einbinden
app.include_router(benutzer.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(bericht.router)
app.include_router(krankenkasse_router)
app.include_router(unfallbetrieb_router)
app.include_router(uv_traeger_router)
app.include_router(icd.router)
app.include_router(pdf_router)
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
