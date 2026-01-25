"""
Bericht Model (Durchgangsarztbericht F1000) - ERWEITERT
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Date, Time, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Bericht(Base):
    """Bericht Datenbank Model - Vollständig für F1000"""
    __tablename__ = "bericht"

    # ===== META =====
    id = Column(Integer, primary_key=True, index=True)
    lfd_nr = Column(String(50), unique=True, nullable=False, index=True)
    benutzer_id = Column(Integer, ForeignKey("benutzer.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False)
    uv_traeger_id = Column(Integer, ForeignKey("uv_traeger.id"), nullable=True)
    unfallbetrieb_id = Column(Integer, ForeignKey("unfallbetrieb.id"), nullable=True)
    
    status = Column(String(20), default="entwurf")  # entwurf | abgeschlossen
    eingetroffen_datum = Column(Date, nullable=True)
    eingetroffen_uhrzeit = Column(Time, nullable=True)
    kopie_an_kasse = Column(Boolean, default=False)
    
    # NEU: Pflegeunfall Flag
    ist_pflegeunfall = Column(Boolean, default=False)

    # ===== ABSCHNITT 1: UNFALLDATEN =====
    unfalltag = Column(Date, nullable=False)
    unfallzeit = Column(Time, nullable=True)
    unfallort = Column(String(255), nullable=True)
    arbeitszeit_beginn = Column(Time, nullable=True)
    arbeitszeit_ende = Column(Time, nullable=True)

    # ===== ABSCHNITT 2: UNFALLHERGANG =====
    unfallhergang = Column(Text, nullable=True)
    taetigkeit_bei_unfall = Column(Text, nullable=True)

    # ===== ABSCHNITT 3: VERHALTEN NACH UNFALL =====
    verhalten_nach_unfall = Column(Text, nullable=True)

    # ===== ABSCHNITT 4: ERSTVERSORGUNG =====
    art_erstversorgung = Column(Text, nullable=True)
    erstbehandlung_datum = Column(Date, nullable=True)
    erstbehandlung_durch = Column(String(255), nullable=True)

    # ===== ABSCHNITT 5: BEFUND =====
    verdacht_alkohol_drogen = Column(Boolean, default=False)
    alkohol_drogen_anzeichen = Column(Text, nullable=True)
    blutentnahme_durchgefuehrt = Column(Boolean, default=False)
    beschwerden_klagen = Column(Text, nullable=True)
    handverletzung = Column(Boolean, default=False)
    gebrauchshand = Column(String(10), nullable=True)  # rechts | links
    klinische_befunde = Column(Text, nullable=True)
    polytrauma = Column(Boolean, default=False)
    iss_score = Column(Integer, nullable=True)

    # ===== ABSCHNITT 6: BILDGEBENDE DIAGNOSTIK =====
    bildgebende_diagnostik = Column(Text, nullable=True)

    # ===== ABSCHNITT 7: ERSTDIAGNOSE =====
    erstdiagnose_freitext = Column(Text, nullable=True)
    erstdiagnose_icd10 = Column(String(20), nullable=True)
    erstdiagnose_ao = Column(String(50), nullable=True)

    # ===== ABSCHNITT 8: D-ÄRZTLICHE VERSORGUNG =====
    art_da_versorgung = Column(Text, nullable=True)

    # ===== ABSCHNITT 9: VORERKRANKUNGEN =====
    vorerkrankungen = Column(Text, nullable=True)

    # ===== ABSCHNITT 10: ZWEIFEL AN ARBEITSUNFALL =====
    zweifel_arbeitsunfall = Column(Boolean, default=False)
    zweifel_begruendung = Column(Text, nullable=True)

    # ===== ABSCHNITT 11: HEILBEHANDLUNG =====
    heilbehandlung_art = Column(String(50), nullable=True)  # ambulant | stationaer | keine
    keine_heilbehandlung_grund = Column(Text, nullable=True)
    verletzung_vav = Column(Boolean, default=False)
    verletzung_vav_ziffer = Column(String(50), nullable=True)
    verletzung_sav = Column(Boolean, default=False)
    verletzung_sav_ziffer = Column(String(50), nullable=True)

    # ===== ABSCHNITT 12: WEITERBEHANDLUNG =====
    weiterbehandlung_durch = Column(String(20), nullable=True)  # durch_mich | andere_arzt
    anderer_arzt_name = Column(String(255), nullable=True)
    anderer_arzt_adresse = Column(Text, nullable=True)

    # ===== ABSCHNITT 13: ARBEITSFÄHIGKEIT =====
    arbeitsfaehig = Column(Boolean, nullable=True)
    arbeitsunfaehig_ab = Column(Date, nullable=True)
    arbeitsfaehig_ab = Column(Date, nullable=True)
    au_laenger_3_monate = Column(Boolean, default=False)

    # ===== ABSCHNITT 14: WEITERE ÄRZTE =====
    weitere_aerzte_noetig = Column(Boolean, default=False)
    weitere_aerzte_namen = Column(Text, nullable=True)

    # ===== ABSCHNITT 15: WIEDERVORSTELLUNG =====
    wiedervorstellung_datum = Column(Date, nullable=True)
    wiedervorstellung_mitgeteilt = Column(Boolean, default=False)

    # ===== ABSCHNITT 16: BEMERKUNGEN =====
    bemerkungen = Column(Text, nullable=True)

    # ===== SEITE 2: WEITERE AUSFÜHRUNGEN =====
    weitere_ausfuehrungen = Column(Text, nullable=True)

    # ===== DATENSCHUTZ & VERTEILER =====
    datenschutz_hinweis_gegeben = Column(Boolean, default=True)
    mitteilung_behandelnder_arzt = Column(Text, nullable=True)
    # NEU: Datum der Mitteilung
    datum_mitteilung_behandelnder_arzt = Column(Date, nullable=True)

    # ===== ERGÄNZUNGSBERICHTE (CHECKBOXEN) =====
    ergaenzung_kopfverletzung = Column(Boolean, default=False)
    ergaenzung_knieverletzung = Column(Boolean, default=False)
    ergaenzung_schulterverletzung = Column(Boolean, default=False)
    ergaenzung_verbrennung = Column(Boolean, default=False)

    # ===== SYSTEM-FELDER =====
    erstellt_am = Column(DateTime, default=datetime.utcnow)
    aktualisiert_am = Column(DateTime, onupdate=datetime.utcnow)
    abgeschlossen_am = Column(DateTime, nullable=True)
    pdf_generiert_am = Column(DateTime, nullable=True)

    # ===== RELATIONSHIPS =====
    benutzer = relationship("Benutzer", back_populates="berichte")
    patient = relationship("Patient", back_populates="berichte")
    uv_traeger = relationship("UVTraeger", back_populates="berichte")
    unfallbetrieb = relationship("Unfallbetrieb", back_populates="berichte")
