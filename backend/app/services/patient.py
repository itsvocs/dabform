"""
Patient CRUD Service
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate

def get_patient_by_id(db: Session, patient_id: int) -> Optional[Patient]:
    """Patient per ID holen"""
    return db.query(Patient).filter(Patient.id == patient_id).first()

def get_all_patients(db: Session, skip: int = 0, limit: int = 100) -> List[Patient]:
    """Alle Patienten holen"""
    return db.query(Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: PatientCreate) -> Patient:
    """Patient erstellen"""
    db_patient = Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: int, patient_update: PatientUpdate) -> Optional[Patient]:
    """Patient aktualisieren"""
    db_patient = get_patient_by_id(db, patient_id)
    if not db_patient:
        return None

    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_patient, field, value)

    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int) -> bool:
    """Patient löschen"""
    db_patient = get_patient_by_id(db, patient_id)
    if not db_patient:
        return False
    db.delete(db_patient)
    db.commit()
    return True
