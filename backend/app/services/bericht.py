"""
Bericht CRUD Service
"""
#pylint: disable=line-too-long
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.bericht import Bericht
from app.schemas.bericht import BerichtCreate, BerichtUpdate

def get_bericht_by_id(db: Session, bericht_id: int) -> Optional[Bericht]:
    """Bericht per ID holen"""
    return db.query(Bericht).filter(Bericht.id == bericht_id).first()

def get_bericht_by_lfd_nr(db: Session, lfd_nr: str) -> Optional[Bericht]:
    """Bericht per Laufende Nummer holen"""
    return db.query(Bericht).filter(Bericht.lfd_nr == lfd_nr).first()

def get_all_berichte(db: Session, skip: int = 0, limit: int = 100) -> List[Bericht]:
    """Alle Berichte holen (mit Pagination)"""
    return db.query(Bericht).offset(skip).limit(limit).all()

def get_berichte_by_benutzer(db: Session, benutzer_id: int, skip: int = 0, limit: int = 100) -> List[Bericht]:
    """Berichte eines Benutzers holen"""
    return db.query(Bericht).filter(
        Bericht.benutzer_id == benutzer_id
    ).offset(skip).limit(limit).all()

def get_berichte_by_patient(db: Session, patient_id: int) -> List[Bericht]:
    """Alle Berichte eines Patienten"""
    return db.query(Bericht).filter(Bericht.patient_id == patient_id).all()

def create_bericht(db: Session, bericht: BerichtCreate, benutzer_id: int) -> Bericht:
    """Neuen Bericht erstellen"""
    # Check ob lfd_nr schon existiert
    existing = get_bericht_by_lfd_nr(db, bericht.lfd_nr)
    if existing:
        raise ValueError(f"Bericht mit Lfd. Nr. {bericht.lfd_nr} existiert bereits")

    # Status excluden (wird immer auf 'entwurf' gesetzt)
    bericht_data = bericht.model_dump(exclude={'status'})

    # Bericht erstellen
    db_bericht = Bericht(
        **bericht_data,
        benutzer_id=benutzer_id,
        status="entwurf"
    )

    db.add(db_bericht)
    db.commit()
    db.refresh(db_bericht)
    return db_bericht



def update_bericht(db: Session, bericht_id: int, bericht_update: BerichtUpdate) -> Optional[Bericht]:
    """Bericht aktualisieren"""
    db_bericht = get_bericht_by_id(db, bericht_id)
    if not db_bericht:
        return None

    # Nur gesetzte Felder updaten
    update_data = bericht_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_bericht, field, value)

    db.commit()
    db.refresh(db_bericht)
    return db_bericht

def abschliessen_bericht(db: Session, bericht_id: int) -> Optional[Bericht]:
    """Bericht abschließen"""
    db_bericht = get_bericht_by_id(db, bericht_id)
    if not db_bericht:
        return None

    db_bericht.status = "abgeschlossen"
    db_bericht.abgeschlossen_am = datetime.utcnow()

    db.commit()
    db.refresh(db_bericht)
    return db_bericht

def delete_bericht(db: Session, bericht_id: int) -> bool:
    """Bericht löschen (nur Entwurf!)"""
    db_bericht = get_bericht_by_id(db, bericht_id)
    if not db_bericht:
        return False

    # Nur Entwürfe löschen
    if db_bericht.status == "abgeschlossen":
        raise ValueError("Abgeschlossene Berichte können nicht gelöscht werden")

    db.delete(db_bericht)
    db.commit()
    return True
