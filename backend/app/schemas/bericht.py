"""
Bericht Schemas (vereinfacht für erste API)
"""

from typing import Optional
from datetime import date, datetime, time
from pydantic import BaseModel, Field

class BerichtBase(BaseModel):
    """Basis Bericht Felder"""
    lfd_nr: str = Field(..., min_length=1, max_length=50)
    patient_id: int
    unfalltag: date
    # status: str = Field(default="entwurf", pattern="^(entwurf|abgeschlossen)$")

class BerichtCreate(BerichtBase):
    """Bericht erstellen"""
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = Field(None, max_length=255)
    unfallhergang: Optional[str] = None
    uv_traeger_id: Optional[int] = None
    unfallbetrieb_id: Optional[int] = None

class BerichtUpdate(BaseModel):
    """Bericht aktualisieren"""
    status: Optional[str] = Field(None, pattern="^(entwurf|abgeschlossen)$")
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = None
    unfallhergang: Optional[str] = None
    beschwerden_klagen: Optional[str] = None
    erstdiagnose_freitext: Optional[str] = None

class BerichtResponse(BerichtBase):
    """Bericht Response"""
    id: int
    benutzer_id: int
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = None
    erstellt_am: datetime
    aktualisiert_am: Optional[datetime] = None
    abgeschlossen_am: Optional[datetime] = None

    class Config:
        """ Config """
        from_attributes = True
