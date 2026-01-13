"""
Bericht Schemas (vollständig für alle F1000 Felder)
"""

from typing import Optional
from datetime import date, datetime, time
from pydantic import BaseModel, Field


class BerichtBase(BaseModel):
    """Basis Bericht Felder - Pflichtfelder"""
    lfd_nr: str = Field(..., min_length=1, max_length=50)
    patient_id: int
    unfalltag: date


class BerichtCreate(BerichtBase):
    """Bericht erstellen - alle Felder die beim Erstellen gesetzt werden können"""
    
    # Meta
    uv_traeger_id: Optional[int] = None
    unfallbetrieb_id: Optional[int] = None
    status: str = Field(default="entwurf", pattern="^(entwurf|abgeschlossen)$")
    eingetroffen_datum: Optional[date] = None
    eingetroffen_uhrzeit: Optional[time] = None
    kopie_an_kasse: bool = False
    
    # Abschnitt 1: Unfalldaten
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = Field(None, max_length=255)
    arbeitszeit_beginn: Optional[time] = None
    arbeitszeit_ende: Optional[time] = None
    
    # Abschnitt 2: Unfallhergang
    unfallhergang: Optional[str] = None
    taetigkeit_bei_unfall: Optional[str] = None
    
    # Abschnitt 3: Verhalten nach Unfall
    verhalten_nach_unfall: Optional[str] = None
    
    # Abschnitt 4: Erstversorgung
    art_erstversorgung: Optional[str] = None
    erstbehandlung_datum: Optional[date] = None
    erstbehandlung_durch: Optional[str] = Field(None, max_length=255)
    
    # Abschnitt 5: Befund
    verdacht_alkohol_drogen: bool = False
    alkohol_drogen_anzeichen: Optional[str] = None
    blutentnahme_durchgefuehrt: bool = False
    beschwerden_klagen: Optional[str] = None
    handverletzung: bool = False
    gebrauchshand: Optional[str] = Field(None, pattern="^(rechts|links)$")
    klinische_befunde: Optional[str] = None
    polytrauma: bool = False
    iss_score: Optional[int] = Field(None, ge=0, le=75)
    
    # Abschnitt 6: Bildgebende Diagnostik
    bildgebende_diagnostik: Optional[str] = None
    
    # Abschnitt 7: Erstdiagnose
    erstdiagnose_freitext: Optional[str] = None
    erstdiagnose_icd10: Optional[str] = Field(None, max_length=20)
    erstdiagnose_ao: Optional[str] = Field(None, max_length=50)
    
    # Abschnitt 8: D-Ärztliche Versorgung
    art_da_versorgung: Optional[str] = None
    
    # Abschnitt 9: Vorerkrankungen
    vorerkrankungen: Optional[str] = None
    
    # Abschnitt 10: Zweifel an Arbeitsunfall
    zweifel_arbeitsunfall: bool = False
    zweifel_begruendung: Optional[str] = None
    
    # Abschnitt 11: Heilbehandlung
    heilbehandlung_art: Optional[str] = Field(None, max_length=50)
    keine_heilbehandlung_grund: Optional[str] = None
    verletzung_vav: bool = False
    verletzung_vav_ziffer: Optional[str] = Field(None, max_length=50)
    verletzung_sav: bool = False
    verletzung_sav_ziffer: Optional[str] = Field(None, max_length=50)
    
    # Abschnitt 12: Weiterbehandlung
    weiterbehandlung_durch: Optional[str] = Field(None, pattern="^(selbst|anderer_arzt)$")
    anderer_arzt_name: Optional[str] = Field(None, max_length=255)
    anderer_arzt_adresse: Optional[str] = None
    
    # Abschnitt 13: Arbeitsfähigkeit
    arbeitsfaehig: Optional[bool] = None
    arbeitsunfaehig_ab: Optional[date] = None
    arbeitsfaehig_ab: Optional[date] = None
    au_laenger_3_monate: bool = False
    
    # Abschnitt 14: Weitere Ärzte
    weitere_aerzte_noetig: bool = False
    weitere_aerzte_namen: Optional[str] = None
    
    # Abschnitt 15: Wiedervorstellung
    wiedervorstellung_datum: Optional[date] = None
    wiedervorstellung_mitgeteilt: bool = False
    
    # Abschnitt 16: Bemerkungen
    bemerkungen: Optional[str] = None
    
    # Seite 2: Weitere Ausführungen
    weitere_ausfuehrungen: Optional[str] = None
    
    # Datenschutz & Verteiler
    datenschutz_hinweis_gegeben: bool = True
    mitteilung_behandelnder_arzt: Optional[str] = None
    
    # Ergänzungsberichte (Checkboxen)
    ergaenzung_kopfverletzung: bool = False
    ergaenzung_knieverletzung: bool = False
    ergaenzung_schulterverletzung: bool = False
    ergaenzung_verbrennung: bool = False


class BerichtUpdate(BaseModel):
    """Bericht aktualisieren - alle Felder optional"""
    
    # Meta (lfd_nr und patient_id nicht änderbar)
    uv_traeger_id: Optional[int] = None
    unfallbetrieb_id: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(entwurf|abgeschlossen)$")
    eingetroffen_datum: Optional[date] = None
    eingetroffen_uhrzeit: Optional[time] = None
    kopie_an_kasse: Optional[bool] = None
    
    # Abschnitt 1: Unfalldaten
    unfalltag: Optional[date] = None
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = Field(None, max_length=255)
    arbeitszeit_beginn: Optional[time] = None
    arbeitszeit_ende: Optional[time] = None
    
    # Abschnitt 2: Unfallhergang
    unfallhergang: Optional[str] = None
    taetigkeit_bei_unfall: Optional[str] = None
    
    # Abschnitt 3: Verhalten nach Unfall
    verhalten_nach_unfall: Optional[str] = None
    
    # Abschnitt 4: Erstversorgung
    art_erstversorgung: Optional[str] = None
    erstbehandlung_datum: Optional[date] = None
    erstbehandlung_durch: Optional[str] = Field(None, max_length=255)
    
    # Abschnitt 5: Befund
    verdacht_alkohol_drogen: Optional[bool] = None
    alkohol_drogen_anzeichen: Optional[str] = None
    blutentnahme_durchgefuehrt: Optional[bool] = None
    beschwerden_klagen: Optional[str] = None
    handverletzung: Optional[bool] = None
    gebrauchshand: Optional[str] = Field(None, pattern="^(rechts|links)$")
    klinische_befunde: Optional[str] = None
    polytrauma: Optional[bool] = None
    iss_score: Optional[int] = Field(None, ge=0, le=75)
    
    # Abschnitt 6: Bildgebende Diagnostik
    bildgebende_diagnostik: Optional[str] = None
    
    # Abschnitt 7: Erstdiagnose
    erstdiagnose_freitext: Optional[str] = None
    erstdiagnose_icd10: Optional[str] = Field(None, max_length=20)
    erstdiagnose_ao: Optional[str] = Field(None, max_length=50)
    
    # Abschnitt 8: D-Ärztliche Versorgung
    art_da_versorgung: Optional[str] = None
    
    # Abschnitt 9: Vorerkrankungen
    vorerkrankungen: Optional[str] = None
    
    # Abschnitt 10: Zweifel an Arbeitsunfall
    zweifel_arbeitsunfall: Optional[bool] = None
    zweifel_begruendung: Optional[str] = None
    
    # Abschnitt 11: Heilbehandlung
    heilbehandlung_art: Optional[str] = Field(None, max_length=50)
    keine_heilbehandlung_grund: Optional[str] = None
    verletzung_vav: Optional[bool] = None
    verletzung_vav_ziffer: Optional[str] = Field(None, max_length=50)
    verletzung_sav: Optional[bool] = None
    verletzung_sav_ziffer: Optional[str] = Field(None, max_length=50)
    
    # Abschnitt 12: Weiterbehandlung
    weiterbehandlung_durch: Optional[str] = Field(None, pattern="^(selbst|anderer_arzt)$")
    anderer_arzt_name: Optional[str] = Field(None, max_length=255)
    anderer_arzt_adresse: Optional[str] = None
    
    # Abschnitt 13: Arbeitsfähigkeit
    arbeitsfaehig: Optional[bool] = None
    arbeitsunfaehig_ab: Optional[date] = None
    arbeitsfaehig_ab: Optional[date] = None
    au_laenger_3_monate: Optional[bool] = None
    
    # Abschnitt 14: Weitere Ärzte
    weitere_aerzte_noetig: Optional[bool] = None
    weitere_aerzte_namen: Optional[str] = None
    
    # Abschnitt 15: Wiedervorstellung
    wiedervorstellung_datum: Optional[date] = None
    wiedervorstellung_mitgeteilt: Optional[bool] = None
    
    # Abschnitt 16: Bemerkungen
    bemerkungen: Optional[str] = None
    
    # Seite 2: Weitere Ausführungen
    weitere_ausfuehrungen: Optional[str] = None
    
    # Datenschutz & Verteiler
    datenschutz_hinweis_gegeben: Optional[bool] = None
    mitteilung_behandelnder_arzt: Optional[str] = None
    
    # Ergänzungsberichte (Checkboxen)
    ergaenzung_kopfverletzung: Optional[bool] = None
    ergaenzung_knieverletzung: Optional[bool] = None
    ergaenzung_schulterverletzung: Optional[bool] = None
    ergaenzung_verbrennung: Optional[bool] = None


class BerichtResponse(BaseModel):
    """Bericht Response - ALLE Felder aus dem Model"""
    
    # Meta
    id: int
    lfd_nr: str
    benutzer_id: int
    patient_id: int
    uv_traeger_id: Optional[int] = None
    unfallbetrieb_id: Optional[int] = None
    status: str
    eingetroffen_datum: Optional[date] = None
    eingetroffen_uhrzeit: Optional[time] = None
    kopie_an_kasse: bool
    
    # Abschnitt 1: Unfalldaten
    unfalltag: date
    unfallzeit: Optional[time] = None
    unfallort: Optional[str] = None
    arbeitszeit_beginn: Optional[time] = None
    arbeitszeit_ende: Optional[time] = None
    
    # Abschnitt 2: Unfallhergang
    unfallhergang: Optional[str] = None
    taetigkeit_bei_unfall: Optional[str] = None
    
    # Abschnitt 3: Verhalten nach Unfall
    verhalten_nach_unfall: Optional[str] = None
    
    # Abschnitt 4: Erstversorgung
    art_erstversorgung: Optional[str] = None
    erstbehandlung_datum: Optional[date] = None
    erstbehandlung_durch: Optional[str] = None
    
    # Abschnitt 5: Befund
    verdacht_alkohol_drogen: bool
    alkohol_drogen_anzeichen: Optional[str] = None
    blutentnahme_durchgefuehrt: bool
    beschwerden_klagen: Optional[str] = None
    handverletzung: bool
    gebrauchshand: Optional[str] = None
    klinische_befunde: Optional[str] = None
    polytrauma: bool
    iss_score: Optional[int] = None
    
    # Abschnitt 6: Bildgebende Diagnostik
    bildgebende_diagnostik: Optional[str] = None
    
    # Abschnitt 7: Erstdiagnose
    erstdiagnose_freitext: Optional[str] = None
    erstdiagnose_icd10: Optional[str] = None
    erstdiagnose_ao: Optional[str] = None
    
    # Abschnitt 8: D-Ärztliche Versorgung
    art_da_versorgung: Optional[str] = None
    
    # Abschnitt 9: Vorerkrankungen
    vorerkrankungen: Optional[str] = None
    
    # Abschnitt 10: Zweifel an Arbeitsunfall
    zweifel_arbeitsunfall: bool
    zweifel_begruendung: Optional[str] = None
    
    # Abschnitt 11: Heilbehandlung
    heilbehandlung_art: Optional[str] = None
    keine_heilbehandlung_grund: Optional[str] = None
    verletzung_vav: bool
    verletzung_vav_ziffer: Optional[str] = None
    verletzung_sav: bool
    verletzung_sav_ziffer: Optional[str] = None
    
    # Abschnitt 12: Weiterbehandlung
    weiterbehandlung_durch: Optional[str] = None
    anderer_arzt_name: Optional[str] = None
    anderer_arzt_adresse: Optional[str] = None
    
    # Abschnitt 13: Arbeitsfähigkeit
    arbeitsfaehig: Optional[bool] = None
    arbeitsunfaehig_ab: Optional[date] = None
    arbeitsfaehig_ab: Optional[date] = None
    au_laenger_3_monate: bool
    
    # Abschnitt 14: Weitere Ärzte
    weitere_aerzte_noetig: bool
    weitere_aerzte_namen: Optional[str] = None
    
    # Abschnitt 15: Wiedervorstellung
    wiedervorstellung_datum: Optional[date] = None
    wiedervorstellung_mitgeteilt: bool
    
    # Abschnitt 16: Bemerkungen
    bemerkungen: Optional[str] = None
    
    # Seite 2: Weitere Ausführungen
    weitere_ausfuehrungen: Optional[str] = None
    
    # Datenschutz & Verteiler
    datenschutz_hinweis_gegeben: bool
    mitteilung_behandelnder_arzt: Optional[str] = None
    
    # Ergänzungsberichte (Checkboxen)
    ergaenzung_kopfverletzung: bool
    ergaenzung_knieverletzung: bool
    ergaenzung_schulterverletzung: bool
    ergaenzung_verbrennung: bool
    
    # System-Felder
    erstellt_am: datetime
    aktualisiert_am: Optional[datetime] = None
    abgeschlossen_am: Optional[datetime] = None
    pdf_generiert_am: Optional[datetime] = None
    
    class Config:
        """Pydantic Config"""
        from_attributes = True