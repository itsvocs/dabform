""" Benutzer Model for the Database - DABFORM """
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
# pylint: disable=not-callable

from app.core.database import Base

class Benutzer(Base):
    """ 
        Benutzer Model for the Database - DABFORM 
        User and Admin 
    """
    __tablename__ = "benutzer"

    #primary key
    id = Column(Integer, primary_key=True, index=True)

    # Authentication
    email = Column(String(255), unique=True, nullable=False, index=True)
    passwort_hash = Column(String(255), nullable=False)

    # Personal Info
    vorname = Column(String(100), nullable=False)
    nachname = Column(String(100), nullable=False)
    titel = Column(String(50), nullable=True)  # Dr., Prof., etc.

    # Role & Status
    rolle = Column(String(20), nullable=False, default='arzt')  # 'arzt' oder 'admin'
    aktiv = Column(Boolean, default=True, nullable=False)

    # Durchgangsarzt Info
    durchgangsarzt_nr = Column(String(50), nullable=True)
    praxis_name = Column(String(255), nullable=True)
    praxis_strasse = Column(String(255), nullable=True)
    praxis_plz = Column(String(10), nullable=True)
    praxis_ort = Column(String(100), nullable=True)
    praxis_telefon = Column(String(50), nullable=True)
    
    berichte = relationship("Bericht", back_populates="benutzer", cascade="all, delete-orphan")

    # Timestamps
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    aktualisiert_am = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        """String Representation für Debugging"""
        return f"<Benutzer(id={self.id}, email='{self.email}', rolle='{self.rolle}')>"
