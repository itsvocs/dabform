"""
Benutzer Schemas für API Request/Response Validation
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ===== BASE SCHEMA =====
class BenutzerBase(BaseModel):
    """Gemeinsame Felder für alle Benutzer Schemas"""
    email: EmailStr
    vorname: str = Field(..., min_length=1, max_length=100)
    nachname: str = Field(..., min_length=1, max_length=100)
    titel: Optional[str] = Field(None, max_length=50)
    rolle: str = Field(default="arzt", pattern="^(arzt|admin)$")

# ===== CREATE SCHEMA =====
class BenutzerCreate(BenutzerBase):
    """Schema für neuen Benutzer erstellen"""
    passwort: str = Field(..., min_length=8, max_length=72)
    durchgangsarzt_nr: Optional[str] = Field(None, max_length=50)
    praxis_name: Optional[str] = Field(None, max_length=255)
    praxis_telefon: Optional[str] = Field(None, max_length=50)

# ===== UPDATE SCHEMA  =====
class BenutzerUpdate(BaseModel):
    """Schema für Benutzer aktualisieren (alle Felder optional)"""
    email: Optional[EmailStr] = None
    vorname: Optional[str] = Field(None, min_length=1, max_length=100)
    nachname: Optional[str] = Field(None, min_length=1, max_length=100)
    titel: Optional[str] = None
    durchgangsarzt_nr: Optional[str] = None
    praxis_name: Optional[str] = None
    praxis_telefon: Optional[str] = None
    aktiv: Optional[bool] = None

# ===== RESPONSE SCHEMA (für API Response) =====
class BenutzerResponse(BenutzerBase):
    """Schema für API Response """
    id: int
    durchgangsarzt_nr: Optional[str] = None
    praxis_name: Optional[str] = None
    praxis_telefon: Optional[str] = None
    aktiv: bool
    erstellt_am: datetime
    aktualisiert_am: Optional[datetime] = None

    class Config:
        """ Config """
        from_attributes = True  # Erlaubt SQLAlchemy Model → Pydantic2
