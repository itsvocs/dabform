"""
Unfallbetrieb CRUD Service
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.unfallbetrieb import Unfallbetrieb
from app.schemas.unfallbetrieb import UnfallbetriebCreate, UnfallbetriebUpdate


def get_unfallbetrieb_by_id(db: Session, unfallbetrieb_id: int) -> Optional[Unfallbetrieb]:
    """Unfallbetrieb per ID holen"""
    return db.query(Unfallbetrieb).filter(Unfallbetrieb.id == unfallbetrieb_id).first()


def get_all_unfallbetriebe(db: Session, skip: int = 0, limit: int = 100) -> List[Unfallbetrieb]:
    """Alle Unfallbetriebe holen"""
    return db.query(Unfallbetrieb).offset(skip).limit(limit).all()


def search_unfallbetriebe(db: Session, query: str, limit: int = 20) -> List[Unfallbetrieb]:
    """Unfallbetriebe suchen (Name oder Ort)"""
    search = f"%{query}%"
    return db.query(Unfallbetrieb).filter(
        (Unfallbetrieb.name.ilike(search)) | (Unfallbetrieb.ort.ilike(search))
    ).limit(limit).all()


def create_unfallbetrieb(db: Session, unfallbetrieb: UnfallbetriebCreate) -> Unfallbetrieb:
    """Neuen Unfallbetrieb erstellen"""
    db_unfallbetrieb = Unfallbetrieb(**unfallbetrieb.model_dump())
    db.add(db_unfallbetrieb)
    db.commit()
    db.refresh(db_unfallbetrieb)
    return db_unfallbetrieb


def update_unfallbetrieb(
    db: Session, 
    unfallbetrieb_id: int, 
    unfallbetrieb_update: UnfallbetriebUpdate
) -> Optional[Unfallbetrieb]:
    """Unfallbetrieb aktualisieren"""
    db_unfallbetrieb = get_unfallbetrieb_by_id(db, unfallbetrieb_id)
    if not db_unfallbetrieb:
        return None
    
    update_data = unfallbetrieb_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_unfallbetrieb, field, value)
    
    db.commit()
    db.refresh(db_unfallbetrieb)
    return db_unfallbetrieb


def delete_unfallbetrieb(db: Session, unfallbetrieb_id: int) -> bool:
    """Unfallbetrieb löschen"""
    db_unfallbetrieb = get_unfallbetrieb_by_id(db, unfallbetrieb_id)
    if not db_unfallbetrieb:
        return False
    
    db.delete(db_unfallbetrieb)
    db.commit()
    return True


def find_or_create_unfallbetrieb(
    db: Session, 
    unfallbetrieb: UnfallbetriebCreate
) -> Unfallbetrieb:
    """
    Unfallbetrieb finden oder erstellen.
    Sucht nach Name + PLZ Kombination.
    """
    existing = db.query(Unfallbetrieb).filter(
        Unfallbetrieb.name == unfallbetrieb.name,
        Unfallbetrieb.plz == unfallbetrieb.plz
    ).first()
    
    if existing:
        return existing
    return create_unfallbetrieb(db, unfallbetrieb)
