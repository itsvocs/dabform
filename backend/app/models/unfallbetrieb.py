"""
Unfallbetrieb Model - Arbeitgeber/Betriebe
"""
# pylint: disable=not-callable

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Unfallbetrieb(Base):
    """
    Unfallbetrieb (Arbeitgeber)

    Tabelle: unfallbetrieb
    """

    __tablename__ = "unfallbetrieb"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    strasse = Column(String(255), nullable=True)
    plz = Column(String(10), nullable=True)
    ort = Column(String(100), nullable=True)
    telefon = Column(String(50), nullable=True)
    branche = Column(String(100), nullable=True)
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    aktualisiert_am = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Unfallbetrieb(id={self.id}, name='{self.name}')>"