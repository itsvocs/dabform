"""
Diagnose Model - Diagnosen (1:n zu Bericht)
"""
# pylint: disable=not-callable
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Diagnose(Base):
    """
    Diagnose
    
    Tabelle: diagnose
    1:n Beziehung zu Bericht (ein Bericht kann mehrere Diagnosen haben)
    """
    
    __tablename__ = "diagnose"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key
    bericht_id = Column(Integer, ForeignKey('bericht.id'), nullable=False, index=True)
    
    # Diagnose Data
    diagnose_text = Column(Text, nullable=False)
    icd10_code = Column(String(20), nullable=False, index=True)
    ao_klassifikation = Column(String(50), nullable=True)
    
    # Flags
    ist_hauptdiagnose = Column(Boolean, default=False, nullable=False)
    reihenfolge = Column(Integer, default=1, nullable=False)
    
    # Timestamp
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Diagnose(id={self.id}, icd10='{self.icd10_code}')>"