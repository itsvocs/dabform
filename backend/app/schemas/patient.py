"""
Patient Schemas - ERWEITERT
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
    # NEU: Name des Hauptversicherten
    familienversichert_name: Optional[str] = Field(None, max_length=255)
    # NEU: Pflegekasse
    pflegekasse: Optional[str] = Field(None, max_length=255)
    beschaeftigt_als: Optional[str] = Field(None, max_length=255)
    # NEU: Beschäftigt seit
    beschaeftigt_seit: Optional[date] = None


class PatientUpdate(BaseModel):
    """Patient aktualisieren (alle optional)"""
    vorname: Optional[str] = Field(None, min_length=1, max_length=100)
    nachname: Optional[str] = Field(None, min_length=1, max_length=100)
    geburtsdatum: Optional[date] = None
    geschlecht: Optional[str] = Field(None, pattern="^(m|w|d)$")
    telefon: Optional[str] = Field(None, max_length=50)
    staatsangehoerigkeit: Optional[str] = Field(None, max_length=100)
    strasse: Optional[str] = Field(None, max_length=255)
    plz: Optional[str] = Field(None, max_length=10)
    ort: Optional[str] = Field(None, max_length=100)
    krankenkasse_id: Optional[int] = None
    familienversichert: Optional[bool] = None
    familienversichert_name: Optional[str] = Field(None, max_length=255)
    pflegekasse: Optional[str] = Field(None, max_length=255)
    beschaeftigt_als: Optional[str] = Field(None, max_length=255)
    beschaeftigt_seit: Optional[date] = None


class PatientResponse(PatientBase):
    """Patient Response"""
    id: int
    staatsangehoerigkeit: Optional[str] = None
    strasse: Optional[str] = None
    plz: Optional[str] = None
    ort: Optional[str] = None
    krankenkasse_id: Optional[int] = None
    familienversichert: bool
    familienversichert_name: Optional[str] = None
    pflegekasse: Optional[str] = None
    beschaeftigt_als: Optional[str] = None
    beschaeftigt_seit: Optional[date] = None
    erstellt_am: datetime
    aktualisiert_am: Optional[datetime] = None

    class Config:
        """Erlaubt Pydantic Access"""
        from_attributes = True
