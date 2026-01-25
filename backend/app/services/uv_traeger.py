"""
UV-Träger CRUD Service
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.uv_traeger import UVTraeger
from app.schemas.uv_traeger import UVTraegerCreate, UVTraegerUpdate


def get_uv_traeger_by_id(db: Session, uv_traeger_id: int) -> Optional[UVTraeger]:
    """UV-Träger per ID holen"""
    return db.query(UVTraeger).filter(UVTraeger.id == uv_traeger_id).first()


def get_uv_traeger_by_kuerzel(db: Session, kuerzel: str) -> Optional[UVTraeger]:
    """UV-Träger per Kürzel holen"""
    return db.query(UVTraeger).filter(UVTraeger.kuerzel == kuerzel).first()


def get_all_uv_traeger(db: Session, skip: int = 0, limit: int = 100) -> List[UVTraeger]:
    """Alle UV-Träger holen"""
    return db.query(UVTraeger).offset(skip).limit(limit).all()


def search_uv_traeger(db: Session, query: str, limit: int = 20) -> List[UVTraeger]:
    """UV-Träger suchen (Name oder Kürzel)"""
    search = f"%{query}%"
    return db.query(UVTraeger).filter(
        (UVTraeger.name.ilike(search)) | (UVTraeger.kuerzel.ilike(search))
    ).limit(limit).all()


def create_uv_traeger(db: Session, uv_traeger: UVTraegerCreate) -> UVTraeger:
    """Neuen UV-Träger erstellen"""
    db_uv_traeger = UVTraeger(**uv_traeger.model_dump())
    db.add(db_uv_traeger)
    db.commit()
    db.refresh(db_uv_traeger)
    return db_uv_traeger


def update_uv_traeger(
    db: Session, 
    uv_traeger_id: int, 
    uv_traeger_update: UVTraegerUpdate
) -> Optional[UVTraeger]:
    """UV-Träger aktualisieren"""
    db_uv_traeger = get_uv_traeger_by_id(db, uv_traeger_id)
    if not db_uv_traeger:
        return None
    
    update_data = uv_traeger_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_uv_traeger, field, value)
    
    db.commit()
    db.refresh(db_uv_traeger)
    return db_uv_traeger


def delete_uv_traeger(db: Session, uv_traeger_id: int) -> bool:
    """UV-Träger löschen"""
    db_uv_traeger = get_uv_traeger_by_id(db, uv_traeger_id)
    if not db_uv_traeger:
        return False
    
    db.delete(db_uv_traeger)
    db.commit()
    return True


def get_or_create_uv_traeger(db: Session, uv_traeger: UVTraegerCreate) -> UVTraeger:
    """UV-Träger holen oder erstellen (für Frontend-Integration)"""
    existing = get_uv_traeger_by_kuerzel(db, uv_traeger.kuerzel)
    if existing:
        return existing
    return create_uv_traeger(db, uv_traeger)
