"""
Patient Model - Versicherte Personen

"""
# pylint: disable=not-callable

from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, DateTime
from app.core.database import Base
from sqlalchemy.sql import func

class Patient(Base):
    """
    Patient (Versicherter)
    
    Tabelle: patient
    """

    __tablename__ = "patient"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Personal Data
    vorname = Column(String(100), nullable=False)
    nachname = Column(String(100), nullable=False)
    geburtsdatum = Column(Date, nullable=False)
    geschlecht = Column(String(10), nullable=True)  # 'm', 'w', 'd'
    staatsangehoerigkeit = Column(String(100), nullable=True)

    # Address
    strasse = Column(String(255), nullable=True)
    plz = Column(String(10), nullable=True)
    ort = Column(String(100), nullable=True)
    telefon = Column(String(50), nullable=True)
    
    # Insurance
    krankenkasse_id = Column(Integer, ForeignKey('krankenkasse.id'), nullable=True)
    familienversichert = Column(Boolean, default=False, nullable=False)
    familienversichert_name = Column(String(255), nullable=True)
    pflegekasse = Column(String(255), nullable=True)
    
    # Employment
    beschaeftigt_als = Column(String(255), nullable=True)
    beschaeftigt_seit = Column(Date, nullable=True)
    
    # Timestamps
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    aktualisiert_am = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Patient(id={self.id}, name='{self.vorname} {self.nachname}')>"