"""
UV-Träger Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class UVTraegerBase(BaseModel):
    """Basis UV-Träger Felder"""
    name: str = Field(..., min_length=1, max_length=255)
    kuerzel: str = Field(..., min_length=1, max_length=50)
    adresse: Optional[str] = Field(None, max_length=500)
    telefon: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None


class UVTraegerCreate(UVTraegerBase):
    """UV-Träger erstellen"""
    pass


class UVTraegerUpdate(BaseModel):
    """UV-Träger aktualisieren (alle optional)"""
    name: Optional[str] = Field(None, max_length=255)
    kuerzel: Optional[str] = Field(None, max_length=50)
    adresse: Optional[str] = Field(None, max_length=500)
    telefon: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None


class UVTraegerResponse(UVTraegerBase):
    """UV-Träger Response"""
    id: int
    erstellt_am: datetime

    class Config:
        from_attributes = True
