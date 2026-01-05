"""
Benutzer API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.benutzer import BenutzerCreate, BenutzerUpdate, BenutzerResponse
from app.services import benutzer as benutzer_service

# Router erstellen
router = APIRouter(
    prefix="/api/benutzer",
    tags=["Benutzer"]
)

# ===== ENDPOINTS =====

@router.post("/", response_model=BenutzerResponse, status_code=status.HTTP_201_CREATED)
def create_benutzer(
    benutzer: BenutzerCreate,
    db: Session = Depends(get_db)
):
    """
    Neuen Benutzer erstellen
    
    - **email**: Gültige Email-Adresse
    - **vorname**: Vorname (min 1 Zeichen)
    - **nachname**: Nachname (min 1 Zeichen)
    - **passwort**: Passwort (min 8 Zeichen)
    - **rolle**: 'arzt' oder 'admin'
    """
    try:
        db_benutzer = benutzer_service.create_benutzer(db, benutzer)
        return db_benutzer
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[BenutzerResponse])
def list_benutzer(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Alle Benutzer auflisten
    
    - **skip**: Anzahl zu überspringen (Pagination)
    - **limit**: Maximale Anzahl (max 100)
    """
    benutzer = benutzer_service.get_all_benutzer(db, skip=skip, limit=limit)
    return benutzer

@router.get("/{benutzer_id}", response_model=BenutzerResponse)
def get_benutzer(
    benutzer_id: int,
    db: Session = Depends(get_db)
):
    """
    Benutzer per ID holen
    """
    db_benutzer = benutzer_service.get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return db_benutzer

@router.put("/{benutzer_id}", response_model=BenutzerResponse)
def update_benutzer(
    benutzer_id: int,
    benutzer_update: BenutzerUpdate,
    db: Session = Depends(get_db)
):
    """
    Benutzer aktualisieren
    """
    db_benutzer = benutzer_service.update_benutzer(db, benutzer_id, benutzer_update)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return db_benutzer

@router.delete("/{benutzer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_benutzer(
    benutzer_id: int,
    db: Session = Depends(get_db)
):
    """
    Benutzer löschen
    """
    success = benutzer_service.delete_benutzer(db, benutzer_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return None