"""
UV-Träger Model - Unfallversicherungsträger
"""
# pylint: disable=not-callable

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class UVTraeger(Base):
    """
    Unfallversicherungsträger (Berufsgenossenschaften)
    
    Tabelle: uv_traeger
    """
    
    __tablename__ = "uv_traeger"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    kuerzel = Column(String(50), nullable=True)  # z.B. "BG BAU"
    adresse = Column(Text, nullable=True)
    telefon = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<UVTraeger(id={self.id}, name='{self.name}')>"