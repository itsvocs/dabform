"""
Krankenkasse API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.krankenkasse import KrankenkasseCreate, KrankenkasseUpdate, KrankenkasseResponse
from app.services import krankenkasse as krankenkasse_service
from app.models.benutzer import Benutzer

router = APIRouter(
    prefix="/api/krankenkassen",
    tags=["Krankenkassen"]
)


@router.post("/", response_model=KrankenkasseResponse, status_code=status.HTTP_201_CREATED)
def create_krankenkasse(
    krankenkasse: KrankenkasseCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Neue Krankenkasse erstellen
    
    Benötigt Authentication
    """
    try:
        return krankenkasse_service.create_krankenkasse(db, krankenkasse)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e


@router.get("/", response_model=List[KrankenkasseResponse])
def list_krankenkassen(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Alle Krankenkassen auflisten
    
    - **search**: Suche nach Name oder Kürzel
    """
    if search:
        return krankenkasse_service.search_krankenkassen(db, search, limit)
    return krankenkasse_service.get_all_krankenkassen(db, skip, limit)


@router.get("/{krankenkasse_id}", response_model=KrankenkasseResponse)
def get_krankenkasse(
    krankenkasse_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Krankenkasse per ID holen"""
    krankenkasse = krankenkasse_service.get_krankenkasse_by_id(db, krankenkasse_id)
    if not krankenkasse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Krankenkasse mit ID {krankenkasse_id} nicht gefunden"
        )
    return krankenkasse


@router.put("/{krankenkasse_id}", response_model=KrankenkasseResponse)
def update_krankenkasse(
    krankenkasse_id: int,
    krankenkasse_update: KrankenkasseUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Krankenkasse aktualisieren"""
    krankenkasse = krankenkasse_service.update_krankenkasse(db, krankenkasse_id, krankenkasse_update)
    if not krankenkasse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Krankenkasse mit ID {krankenkasse_id} nicht gefunden"
        )
    return krankenkasse


@router.delete("/{krankenkasse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_krankenkasse(
    krankenkasse_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Krankenkasse löschen"""
    success = krankenkasse_service.delete_krankenkasse(db, krankenkasse_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Krankenkasse mit ID {krankenkasse_id} nicht gefunden"
        )
    return None
