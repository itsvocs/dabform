"""
UV-Träger Model (Berufsgenossenschaft / Unfallkasse)
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class UVTraeger(Base):
    """UV-Träger Datenbank Model"""
    __tablename__ = "uv_traeger"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    kuerzel = Column(String(50), nullable=False)
    adresse = Column(String(500), nullable=True)
    telefon = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Timestamps
    erstellt_am = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    berichte = relationship("Bericht", back_populates="uv_traeger")
