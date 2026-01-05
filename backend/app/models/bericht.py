"""
Bericht Model - Haupttabelle für DAB-Berichte
Enthält alle 16 Abschnitte des F1000 Formulars
"""
# pylint: disable=not-callable

from sqlalchemy import Column, Integer, String, Date, Time, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Bericht(Base):
    """
    DAB-Bericht (F1000)
    
    Tabelle: bericht
    Enthält alle 16 Abschnitte des Durchgangsarzt-Berichts
    """

    __tablename__ = "bericht"

    # ===== META-DATEN =====
    id = Column(Integer, primary_key=True, index=True)
    lfd_nr = Column(String(50), unique=True, nullable=False, index=True)

    # Foreign Keys
    benutzer_id = Column(Integer, ForeignKey('benutzer.id'), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey('patient.id'), nullable=False, index=True)
    uv_traeger_id = Column(Integer, ForeignKey('uv_traeger.id'), nullable=True)
    unfallbetrieb_id = Column(Integer, ForeignKey('unfallbetrieb.id'), nullable=True)

    # Status
    status = Column(String(20), nullable=False, default='entwurf', index=True)

    # Eingetroffen
    eingetroffen_datum = Column(Date, nullable=True)
    eingetroffen_uhrzeit = Column(Time, nullable=True)
    kopie_an_kasse = Column(Boolean, default=False, nullable=False)


    # ===== ABSCHNITT 1: UNFALLDATEN =====
    unfalltag = Column(Date, nullable=False, index=True)
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
    verdacht_alkohol_drogen = Column(Boolean, default=False, nullable=False)
    alkohol_drogen_anzeichen = Column(Text, nullable=True)
    blutentnahme_durchgefuehrt = Column(Boolean, default=False, nullable=False)
    beschwerden_klagen = Column(Text, nullable=True)
    handverletzung = Column(Boolean, default=False, nullable=False)
    gebrauchshand = Column(String(10), nullable=True)  # 'rechts', 'links'
    klinische_befunde = Column(Text, nullable=True)
    polytrauma = Column(Boolean, default=False, nullable=False)
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
    zweifel_arbeitsunfall = Column(Boolean, default=False, nullable=False)
    zweifel_begruendung = Column(Text, nullable=True)

    # ===== ABSCHNITT 11: HEILBEHANDLUNG =====
    heilbehandlung_art = Column(String(50), nullable=True)
    keine_heilbehandlung_grund = Column(Text, nullable=True)
    verletzung_vav = Column(Boolean, default=False, nullable=False)
    verletzung_vav_ziffer = Column(String(50), nullable=True)
    verletzung_sav = Column(Boolean, default=False, nullable=False)
    verletzung_sav_ziffer = Column(String(50), nullable=True)

    # ===== ABSCHNITT 12: WEITERBEHANDLUNG =====
    weiterbehandlung_durch = Column(String(50), nullable=True)  # 'selbst', 'anderer_arzt'
    anderer_arzt_name = Column(String(255), nullable=True)
    anderer_arzt_adresse = Column(Text, nullable=True)

    # ===== ABSCHNITT 13: ARBEITSFÄHIGKEIT =====
    arbeitsfaehig = Column(Boolean, nullable=True)
    arbeitsunfaehig_ab = Column(Date, nullable=True)
    arbeitsfaehig_ab = Column(Date, nullable=True)
    au_laenger_3_monate = Column(Boolean, default=False, nullable=False)

    # ===== ABSCHNITT 14: WEITERE ÄRZTE =====
    weitere_aerzte_noetig = Column(Boolean, default=False, nullable=False)
    weitere_aerzte_namen = Column(Text, nullable=True)

    # ===== ABSCHNITT 15: WIEDERVORSTELLUNG =====
    wiedervorstellung_datum = Column(Date, nullable=True)
    wiedervorstellung_mitgeteilt = Column(Boolean, default=False, nullable=False)

    # ===== ABSCHNITT 16: BEMERKUNGEN =====
    bemerkungen = Column(Text, nullable=True)

    # ===== SEITE 2: WEITERE AUSFÜHRUNGEN =====
    weitere_ausfuehrungen = Column(Text, nullable=True)

    # ===== DATENSCHUTZ & VERTEILER =====
    datenschutz_hinweis_gegeben = Column(Boolean, default=True, nullable=False)
    mitteilung_behandelnder_arzt = Column(Text, nullable=True)

    # ===== ERGÄNZUNGSBERICHTE (CHECKBOX) =====
    ergaenzung_kopfverletzung = Column(Boolean, default=False, nullable=False)  # F1002
    ergaenzung_knieverletzung = Column(Boolean, default=False, nullable=False)  # F1004
    ergaenzung_schulterverletzung = Column(Boolean, default=False, nullable=False)  # F1006
    ergaenzung_verbrennung = Column(Boolean, default=False, nullable=False)  # F1008

    # ===== SYSTEM-FELDER =====
    erstellt_am = Column(DateTime(timezone=True), server_default=func.now())
    aktualisiert_am = Column(DateTime(timezone=True), onupdate=func.now())
    abgeschlossen_am = Column(DateTime(timezone=True), nullable=True)
    pdf_generiert_am = Column(DateTime(timezone=True), nullable=True)

    # ===== RELATIONSHIPS =====
    # (werden später für Queries genutzt)
    # benutzer = relationship("Benutzer", backref="berichte")
    # patient = relationship("Patient", backref="berichte")

    def __repr__(self):
        return f"<Bericht(id={self.id}, lfd_nr='{self.lfd_nr}', status='{self.status}')>"
