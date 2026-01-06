"""
Patient API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.services import patient as patient_service
from app.models.benutzer import Benutzer

router = APIRouter(
    prefix="/api/patienten",
    tags=["Patienten"]
)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Neuen Patienten erstellen
    
    Benötigt Authentication
    """
    return patient_service.create_patient(db, patient)

@router.get("/", response_model=List[PatientResponse])
def list_patients(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Alle Patienten auflisten
    
    Benötigt Authentication
    
    - **skip**: Pagination offset
    - **limit**: Max Anzahl (max 100)
    - **search**: Suche nach Name
    """
    if search:
        return patient_service.search_patients(db, search, skip, limit)
    return patient_service.get_all_patients(db, skip, limit)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    #current_user: Benutzer = Depends(get_current_user)
):
    """
    Patient per ID holen
    
    Benötigt Authentication
    """
    patient = patient_service.get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient mit ID {patient_id} nicht gefunden"
        )
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Patient aktualisieren
    
     Benötigt Authentication
    """
    patient = patient_service.update_patient(db, patient_id, patient_update)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient mit ID {patient_id} nicht gefunden"
        )
    return patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Patient löschen
    
    Benötigt Authentication
    """
    success = patient_service.delete_patient(db, patient_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient mit ID {patient_id} nicht gefunden"
        )
    return None
