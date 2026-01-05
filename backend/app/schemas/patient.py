"""
Patient Schemas
"""

from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field

class PatientBase(BaseModel):
    """Basis Patient Felder"""
    vorname: str = Field(..., min_length=1, max_length=100)
    nachname: str = Field(..., min_length=1, max_length=100)
    geburtsdatum: date
    geschlecht: Optional[str] = Field(None, pattern="^(m|w|d)$")
    telefon: Optional[str] = Field(None, max_length=50)

class PatientCreate(PatientBase):
    """Patient erstellen"""
    staatsangehoerigkeit: Optional[str] = Field(None, max_length=100)
    strasse: Optional[str] = Field(None, max_length=255)
    plz: Optional[str] = Field(None, max_length=10)
    ort: Optional[str] = Field(None, max_length=100)
    krankenkasse_id: Optional[int] = None
    familienversichert: bool = False
    beschaeftigt_als: Optional[str] = None

class PatientUpdate(BaseModel):
    """Patient aktualisieren (alle optional)"""
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    telefon: Optional[str] = None
    strasse: Optional[str] = None
    plz: Optional[str] = None
    ort: Optional[str] = None

class PatientResponse(PatientBase):
    """Patient Response"""
    id: int
    staatsangehoerigkeit: Optional[str] = None
    strasse: Optional[str] = None
    plz: Optional[str] = None
    ort: Optional[str] = None
    erstellt_am: datetime

    class Config:
        """Erlaubt Pedantic Access"""
        from_attributes = True
