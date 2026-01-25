"""
Unfallbetrieb Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class UnfallbetriebBase(BaseModel):
    """Basis Unfallbetrieb Felder"""
    name: str = Field(..., min_length=1, max_length=255)
    strasse: Optional[str] = Field(None, max_length=255)
    plz: Optional[str] = Field(None, pattern=r"^\d{5}$")
    ort: Optional[str] = Field(None, max_length=100)
    telefon: Optional[str] = Field(None, max_length=50)
    branche: Optional[str] = Field(None, max_length=255)


class UnfallbetriebCreate(UnfallbetriebBase):
    """Unfallbetrieb erstellen"""
    pass


class UnfallbetriebUpdate(BaseModel):
    """Unfallbetrieb aktualisieren (alle optional)"""
    name: Optional[str] = Field(None, max_length=255)
    strasse: Optional[str] = Field(None, max_length=255)
    plz: Optional[str] = Field(None, pattern=r"^\d{5}$")
    ort: Optional[str] = Field(None, max_length=100)
    telefon: Optional[str] = Field(None, max_length=50)
    branche: Optional[str] = Field(None, max_length=255)


class UnfallbetriebResponse(UnfallbetriebBase):
    """Unfallbetrieb Response"""
    id: int
    erstellt_am: datetime

    class Config:
        from_attributes = True
