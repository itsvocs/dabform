"""
Bericht API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.bericht import BerichtCreate, BerichtUpdate, BerichtResponse
from app.services import bericht as bericht_service
from app.models.benutzer import Benutzer

router = APIRouter(
    prefix="/api/berichte",
    tags=["Berichte"]
)

@router.post("/", response_model=BerichtResponse, status_code=status.HTTP_201_CREATED)
def create_bericht(
    bericht: BerichtCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Neuen Bericht erstellen
    
    Benötigt Authentication
    Bericht wird dem eingeloggten Benutzer zugeordnet
    """
    try:
        return bericht_service.create_bericht(db, bericht, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e

@router.get("/", response_model=List[BerichtResponse])
def list_berichte(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    patient_id: int = None,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Berichte auflisten
    
    Benötigt Authentication
    
    - Arzt: Nur eigene Berichte
    - Admin: Alle Berichte
    - **patient_id**: Filter nach Patient
    """
    # Admin sieht alle
    if current_user.rolle == "admin":
        if patient_id:
            return bericht_service.get_berichte_by_patient(db, patient_id)
        return bericht_service.get_all_berichte(db, skip, limit)

    # Arzt sieht nur eigene
    if patient_id:
        # Nur eigene Berichte für diesen Patienten
        berichte = bericht_service.get_berichte_by_patient(db, patient_id)
        return [b for b in berichte if b.benutzer_id == current_user.id]

    return bericht_service.get_berichte_by_benutzer(db, current_user.id, skip, limit)

@router.get("/{bericht_id}", response_model=BerichtResponse)
def get_bericht(
    bericht_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Bericht per ID holen
    
    Benötigt Authentication
    """
    bericht = bericht_service.get_bericht_by_id(db, bericht_id)

    if not bericht:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bericht mit ID {bericht_id} nicht gefunden"
        )

    # Check Berechtigung (Arzt nur eigene)
    if current_user.rolle != "admin" and bericht.benutzer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Bericht"
        )

    return bericht

@router.put("/{bericht_id}", response_model=BerichtResponse)
def update_bericht(
    bericht_id: int,
    bericht_update: BerichtUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Bericht aktualisieren
    
    Benötigt Authentication
    Nur eigene Berichte editierbar
    """
    bericht = bericht_service.get_bericht_by_id(db, bericht_id)

    if not bericht:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bericht mit ID {bericht_id} nicht gefunden"
        )

    # Check Berechtigung
    if current_user.rolle != "admin" and bericht.benutzer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können diesen Bericht nicht editieren weil Sie den nicht erstellt haben"
        )

    updated = bericht_service.update_bericht(db, bericht_id, bericht_update)
    return updated

@router.post("/{bericht_id}/abschliessen", response_model=BerichtResponse)
def abschliessen_bericht(
    bericht_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Bericht abschließen
    
    Benötigt Authentication
    Status wird auf 'abgeschlossen' gesetzt
    """
    bericht = bericht_service.get_bericht_by_id(db, bericht_id)

    if not bericht:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bericht mit ID {bericht_id} nicht gefunden"
        )

    # Check Berechtigung
    if current_user.rolle != "admin" and bericht.benutzer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Bericht"
        )

    return bericht_service.abschliessen_bericht(db, bericht_id)

@router.delete("/{bericht_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bericht(
    bericht_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Bericht löschen
    
    Benötigt Authentication
    Nur Entwürfe können gelöscht werden!
    """
    bericht = bericht_service.get_bericht_by_id(db, bericht_id)

    if not bericht:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bericht mit ID {bericht_id} nicht gefunden"
        )

    # Check Berechtigung
    if current_user.rolle != "admin" and bericht.benutzer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Bericht"
        )

    try:
        bericht_service.delete_bericht(db, bericht_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e 

    return None
