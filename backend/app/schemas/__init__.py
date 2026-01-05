"""
Schemas Package
Alle Pydantic Schemas für API Validation
"""

from app.schemas.benutzer import (
    BenutzerCreate,
    BenutzerUpdate,
    BenutzerResponse
)
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)
from app.schemas.bericht import (
    BerichtCreate,
    BerichtUpdate,
    BerichtResponse
)

__all__ = [
    "BenutzerCreate",
    "BenutzerUpdate",
    "BenutzerResponse",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "BerichtCreate",
    "BerichtUpdate",
    "BerichtResponse",
]
