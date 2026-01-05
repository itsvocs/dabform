"""
Krankenkasse Model - Krankenkassen-Stammdaten
"""
# pylint: disable=not-callable

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Krankenkasse(Base):
    """
    Krankenkasse Stammdaten
    
    Tabelle: krankenkasse
    """
    
    __tablename__ = "krankenkasse"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Data
    name = Column(String(255), nullable=False)
    kuerzel = Column(String(20), nullable=True)  # z.B. "AOK", "TK"
    ik_nummer = Column(String(20), nullable=True)  # Institutionskennzeichen
    
    # Timestamp
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Krankenkasse(id={self.id}, name='{self.name}')>"