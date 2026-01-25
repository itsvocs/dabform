"""
Unfallbetrieb Model
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Unfallbetrieb(Base):
    """Unfallbetrieb Datenbank Model"""
    __tablename__ = "unfallbetrieb"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    strasse = Column(String(255), nullable=True)
    plz = Column(String(10), nullable=True)
    ort = Column(String(100), nullable=True)
    telefon = Column(String(50), nullable=True)
    branche = Column(String(255), nullable=True)
    
    # Timestamps
    erstellt_am = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    berichte = relationship("Bericht", back_populates="unfallbetrieb")