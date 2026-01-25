"""
Krankenkasse Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class KrankenkasseBase(BaseModel):
    """Basis Krankenkasse Felder"""
    name: str = Field(..., min_length=1, max_length=255)
    kuerzel: str = Field(..., min_length=1, max_length=50)
    ik_nummer: str = Field(..., min_length=1, max_length=50)


class KrankenkasseCreate(KrankenkasseBase):
    """Krankenkasse erstellen"""
    pass


class KrankenkasseUpdate(BaseModel):
    """Krankenkasse aktualisieren (alle optional)"""
    name: Optional[str] = Field(None, max_length=255)
    kuerzel: Optional[str] = Field(None, max_length=50)
    ik_nummer: Optional[str] = Field(None, max_length=50)


class KrankenkasseResponse(KrankenkasseBase):
    """Krankenkasse Response"""
    id: int
    erstellt_am: datetime

    class Config:
        from_attributes = True
