"""
Patient Model - ERWEITERT
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Patient(Base):
    """Patient Datenbank Model - Erweitert für F1000"""
    __tablename__ = "patient"

    # ===== STAMMDATEN =====
    id = Column(Integer, primary_key=True, index=True)
    vorname = Column(String(100), nullable=False)
    nachname = Column(String(100), nullable=False, index=True)
    geburtsdatum = Column(Date, nullable=False)
    geschlecht = Column(String(1), nullable=True)  # m | w | d
    telefon = Column(String(50), nullable=True)
    staatsangehoerigkeit = Column(String(100), nullable=True)

    # ===== ANSCHRIFT =====
    strasse = Column(String(255), nullable=True)
    plz = Column(String(10), nullable=True)
    ort = Column(String(100), nullable=True)

    # ===== VERSICHERUNG =====
    krankenkasse_id = Column(Integer, ForeignKey("krankenkasse.id"), nullable=True)
    familienversichert = Column(Boolean, default=False)
    # NEU: Name des Hauptversicherten bei Familienversicherung
    familienversichert_name = Column(String(255), nullable=True)
    # NEU: Pflegekasse (bei Pflegeunfall)
    pflegekasse = Column(String(255), nullable=True)

    # ===== BESCHÄFTIGUNG =====
    beschaeftigt_als = Column(String(255), nullable=True)
    # NEU: Beschäftigt seit
    beschaeftigt_seit = Column(Date, nullable=True)

    # ===== SYSTEM-FELDER =====
    erstellt_am = Column(DateTime, default=datetime.utcnow)
    aktualisiert_am = Column(DateTime, onupdate=datetime.utcnow)

    # ===== RELATIONSHIPS =====
    krankenkasse = relationship("Krankenkasse", back_populates="patienten")
    berichte = relationship("Bericht", back_populates="patient")
