"""
Models Package
Alle SQLAlchemy Models für Alembic und FastAPI
"""

from app.models.benutzer import Benutzer
from app.models.patient import Patient
from app.models.krankenkasse import Krankenkasse
from app.models.uv_traeger import UVTraeger
from app.models.unfallbetrieb import Unfallbetrieb
from app.models.bericht import Bericht
from app.models.diagnose import Diagnose

# Für Alembic wichtig!
__all__ = [
    "Benutzer",
    "Patient",
    "Krankenkasse",
    "UVTraeger",
    "Unfallbetrieb",
    "Bericht",
    "Diagnose",
]