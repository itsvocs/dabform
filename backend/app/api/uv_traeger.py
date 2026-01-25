"""
UV-Träger API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.uv_traeger import UVTraegerCreate, UVTraegerUpdate, UVTraegerResponse
from app.services import uv_traeger as uv_traeger_service
from app.models.benutzer import Benutzer

router = APIRouter(
    prefix="/api/uv-traeger",
    tags=["UV-Träger"]
)


@router.post("/", response_model=UVTraegerResponse, status_code=status.HTTP_201_CREATED)
def create_uv_traeger(
    uv_traeger: UVTraegerCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Neuen UV-Träger erstellen
    
    Benötigt Authentication
    """
    return uv_traeger_service.create_uv_traeger(db, uv_traeger)


@router.get("/", response_model=List[UVTraegerResponse])
def list_uv_traeger(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Alle UV-Träger auflisten
    
    - **search**: Suche nach Name oder Kürzel
    """
    if search:
        return uv_traeger_service.search_uv_traeger(db, search, limit)
    return uv_traeger_service.get_all_uv_traeger(db, skip, limit)


@router.get("/{uv_traeger_id}", response_model=UVTraegerResponse)
def get_uv_traeger(
    uv_traeger_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """UV-Träger per ID holen"""
    uv_traeger = uv_traeger_service.get_uv_traeger_by_id(db, uv_traeger_id)
    if not uv_traeger:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"UV-Träger mit ID {uv_traeger_id} nicht gefunden"
        )
    return uv_traeger


@router.put("/{uv_traeger_id}", response_model=UVTraegerResponse)
def update_uv_traeger(
    uv_traeger_id: int,
    uv_traeger_update: UVTraegerUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """UV-Träger aktualisieren"""
    uv_traeger = uv_traeger_service.update_uv_traeger(db, uv_traeger_id, uv_traeger_update)
    if not uv_traeger:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"UV-Träger mit ID {uv_traeger_id} nicht gefunden"
        )
    return uv_traeger


@router.delete("/{uv_traeger_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_uv_traeger(
    uv_traeger_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """UV-Träger löschen"""
    success = uv_traeger_service.delete_uv_traeger(db, uv_traeger_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"UV-Träger mit ID {uv_traeger_id} nicht gefunden"
        )
    return None
