"""
Krankenkasse CRUD Service
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.krankenkasse import Krankenkasse
from app.schemas.krankenkasse import KrankenkasseCreate, KrankenkasseUpdate


def get_krankenkasse_by_id(db: Session, krankenkasse_id: int) -> Optional[Krankenkasse]:
    """Krankenkasse per ID holen"""
    return db.query(Krankenkasse).filter(Krankenkasse.id == krankenkasse_id).first()


def get_krankenkasse_by_ik(db: Session, ik_nummer: str) -> Optional[Krankenkasse]:
    """Krankenkasse per IK-Nummer holen"""
    return db.query(Krankenkasse).filter(Krankenkasse.ik_nummer == ik_nummer).first()


def get_all_krankenkassen(db: Session, skip: int = 0, limit: int = 100) -> List[Krankenkasse]:
    """Alle Krankenkassen holen"""
    return db.query(Krankenkasse).offset(skip).limit(limit).all()


def search_krankenkassen(db: Session, query: str, limit: int = 20) -> List[Krankenkasse]:
    """Krankenkassen suchen (Name oder Kürzel)"""
    search = f"%{query}%"
    return db.query(Krankenkasse).filter(
        (Krankenkasse.name.ilike(search)) | (Krankenkasse.kuerzel.ilike(search))
    ).limit(limit).all()


def create_krankenkasse(db: Session, krankenkasse: KrankenkasseCreate) -> Krankenkasse:
    """Neue Krankenkasse erstellen"""
    # Check ob IK-Nummer schon existiert
    existing = get_krankenkasse_by_ik(db, krankenkasse.ik_nummer)
    if existing:
        raise ValueError(f"Krankenkasse mit IK-Nummer {krankenkasse.ik_nummer} existiert bereits")
    
    db_krankenkasse = Krankenkasse(**krankenkasse.model_dump())
    db.add(db_krankenkasse)
    db.commit()
    db.refresh(db_krankenkasse)
    return db_krankenkasse


def update_krankenkasse(
    db: Session, 
    krankenkasse_id: int, 
    krankenkasse_update: KrankenkasseUpdate
) -> Optional[Krankenkasse]:
    """Krankenkasse aktualisieren"""
    db_krankenkasse = get_krankenkasse_by_id(db, krankenkasse_id)
    if not db_krankenkasse:
        return None
    
    update_data = krankenkasse_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_krankenkasse, field, value)
    
    db.commit()
    db.refresh(db_krankenkasse)
    return db_krankenkasse


def delete_krankenkasse(db: Session, krankenkasse_id: int) -> bool:
    """Krankenkasse löschen"""
    db_krankenkasse = get_krankenkasse_by_id(db, krankenkasse_id)
    if not db_krankenkasse:
        return False
    
    db.delete(db_krankenkasse)
    db.commit()
    return True


def get_or_create_krankenkasse(db: Session, krankenkasse: KrankenkasseCreate) -> Krankenkasse:
    """Krankenkasse holen oder erstellen (für Frontend-Integration)"""
    existing = get_krankenkasse_by_ik(db, krankenkasse.ik_nummer)
    if existing:
        return existing
    return create_krankenkasse(db, krankenkasse)
