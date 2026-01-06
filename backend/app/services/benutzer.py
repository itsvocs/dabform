"""
Benutzer CRUD Service
Business Logic für Benutzer-Verwaltung
"""

from typing import List, Optional
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.benutzer import Benutzer
from app.schemas.benutzer import BenutzerCreate, BenutzerUpdate

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Passwort hashen mit bcrypt (max 72 bytes)"""
    # Bcrypt hat 72 Byte Limit
    if len(password.encode('utf-8')) > 72:
        # Truncate auf 72 Bytes
        password = password[:72]
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Passwort verifizieren"""
    return pwd_context.verify(plain_password, hashed_password)

# ===== CRUD FUNCTIONS =====

def get_benutzer_by_id(db: Session, benutzer_id: int) -> Optional[Benutzer]:
    """Benutzer per ID holen"""
    return db.query(Benutzer).filter(Benutzer.id == benutzer_id).first()

def get_benutzer_by_email(db: Session, email: str) -> Optional[Benutzer]:
    """Benutzer per Email holen"""
    return db.query(Benutzer).filter(Benutzer.email == email).first()

def get_all_benutzer(db: Session, skip: int = 0, limit: int = 100) -> List[Benutzer]:
    """Alle Benutzer holen (mit Pagination)"""
    return db.query(Benutzer).offset(skip).limit(limit).all()

def create_benutzer(db: Session, benutzer: BenutzerCreate) -> Benutzer:
    """Neuen Benutzer erstellen"""
    # Check ob Email schon existiert
    existing = get_benutzer_by_email(db, benutzer.email)
    if existing:
        raise ValueError(f"Email {benutzer.email} already exists")

    # Passwort hashen
    hashed_pw = hash_password(benutzer.passwort)

    # Model erstellen
    db_benutzer = Benutzer(
        email=benutzer.email,
        passwort_hash=hashed_pw,
        vorname=benutzer.vorname,
        nachname=benutzer.nachname,
        titel=benutzer.titel,
        rolle="arzt",
        durchgangsarzt_nr=benutzer.durchgangsarzt_nr,
        praxis_name=benutzer.praxis_name,
        praxis_telefon=benutzer.praxis_telefon
    )

    # In DB speichern
    db.add(db_benutzer)
    db.commit()
    db.refresh(db_benutzer)

    return db_benutzer

def update_benutzer(db: Session, benutzer_id: int, benutzer_update: BenutzerUpdate) -> Optional[Benutzer]:
    """Benutzer aktualisieren"""
    db_benutzer = get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        return None

    # Nur gesetzte Felder updaten
    update_data = benutzer_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_benutzer, field, value)

    db.commit()
    db.refresh(db_benutzer)
    return db_benutzer

def delete_benutzer(db: Session, benutzer_id: int) -> bool:
    """Benutzer löschen"""
    db_benutzer = get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        return False

    db.delete(db_benutzer)
    db.commit()
    return True
