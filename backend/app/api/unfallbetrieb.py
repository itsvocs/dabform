"""
Unfallbetrieb API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.unfallbetrieb import UnfallbetriebCreate, UnfallbetriebUpdate, UnfallbetriebResponse
from app.services import unfallbetrieb as unfallbetrieb_service
from app.models.benutzer import Benutzer

router = APIRouter(
    prefix="/api/unfallbetriebe",
    tags=["Unfallbetriebe"]
)


@router.post("/", response_model=UnfallbetriebResponse, status_code=status.HTTP_201_CREATED)
def create_unfallbetrieb(
    unfallbetrieb: UnfallbetriebCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Neuen Unfallbetrieb erstellen
    
    Benötigt Authentication
    """
    return unfallbetrieb_service.create_unfallbetrieb(db, unfallbetrieb)


@router.get("/", response_model=List[UnfallbetriebResponse])
def list_unfallbetriebe(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Alle Unfallbetriebe auflisten
    
    - **search**: Suche nach Name oder Ort
    """
    if search:
        return unfallbetrieb_service.search_unfallbetriebe(db, search, limit)
    return unfallbetrieb_service.get_all_unfallbetriebe(db, skip, limit)


@router.get("/{unfallbetrieb_id}", response_model=UnfallbetriebResponse)
def get_unfallbetrieb(
    unfallbetrieb_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Unfallbetrieb per ID holen"""
    unfallbetrieb = unfallbetrieb_service.get_unfallbetrieb_by_id(db, unfallbetrieb_id)
    if not unfallbetrieb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unfallbetrieb mit ID {unfallbetrieb_id} nicht gefunden"
        )
    return unfallbetrieb


@router.put("/{unfallbetrieb_id}", response_model=UnfallbetriebResponse)
def update_unfallbetrieb(
    unfallbetrieb_id: int,
    unfallbetrieb_update: UnfallbetriebUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Unfallbetrieb aktualisieren"""
    unfallbetrieb = unfallbetrieb_service.update_unfallbetrieb(
        db, unfallbetrieb_id, unfallbetrieb_update
    )
    if not unfallbetrieb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unfallbetrieb mit ID {unfallbetrieb_id} nicht gefunden"
        )
    return unfallbetrieb


@router.delete("/{unfallbetrieb_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unfallbetrieb(
    unfallbetrieb_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Unfallbetrieb löschen"""
    success = unfallbetrieb_service.delete_unfallbetrieb(db, unfallbetrieb_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unfallbetrieb mit ID {unfallbetrieb_id} nicht gefunden"
        )
    return None
