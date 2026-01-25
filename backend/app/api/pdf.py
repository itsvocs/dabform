# app/api/pdf.py
"""
API Endpoints für PDF-Generierung
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
from io import BytesIO

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.benutzer import Benutzer
from app.models.bericht import Bericht
from app.models.patient import Patient
from app.models.unfallbetrieb import Unfallbetrieb
from app.models.uv_traeger import UVTraeger
from app.models.krankenkasse import Krankenkasse
from app.services.pdf_generator import F1000PDFGenerator

router = APIRouter(prefix="/api/berichte", tags=["PDF"])

def _txt(v):
    return v if v is not None else ""

def _to_bool(self, v) -> bool:
    if v is None:
        return False
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return v != 0
    if isinstance(v, str):
        s = v.strip().lower()
        if s in ("true", "1", "yes", "ja", "y", "on"):
            return True
        if s in ("false", "0", "no", "nein", "n", "off", ""):
            return False
    return bool(v)


def _get_bericht_data(bericht: Bericht) -> dict:
    """Konvertiert Bericht-Model zu dict für PDF-Generator"""
    return {
        'id': bericht.id,
        'lfd_nr': _txt(bericht.lfd_nr),
        'status': bericht.status,
        'eingetroffen_datum': _txt(str(bericht.eingetroffen_datum) if bericht.eingetroffen_datum else None),
        'eingetroffen_uhrzeit': bericht.eingetroffen_uhrzeit,
        'kopie_an_kasse': _to_bool(bericht.kopie_an_kasse),
        'ist_pflegeunfall': _to_bool(bericht.ist_pflegeunfall),
        
        # Unfalldaten
        'unfalltag': _txt(str(bericht.unfalltag) if bericht.unfalltag else None),
        'unfallzeit': bericht.unfallzeit,
        'unfallort': _txt(bericht.unfallort),
        'arbeitszeit_beginn': _txt(bericht.arbeitszeit_beginn),
        'arbeitszeit_ende': _txt(bericht.arbeitszeit_ende),
        
        # Unfallhergang
        'unfallhergang': _txt(bericht.unfallhergang),
        'taetigkeit_bei_unfall': _txt(bericht.taetigkeit_bei_unfall),
        'verhalten_nach_unfall': _txt(bericht.verhalten_nach_unfall),
        
        # Erstversorgung
        'art_erstversorgung': _txt(bericht.art_erstversorgung),
        'erstbehandlung_datum': _txt(str(bericht.erstbehandlung_datum) if bericht.erstbehandlung_datum else None),
        'erstbehandlung_durch': bericht.erstbehandlung_durch,
        
        # Befund
        'verdacht_alkohol_drogen': _to_bool(bericht.verdacht_alkohol_drogen),
        'alkohol_drogen_anzeichen': bericht.alkohol_drogen_anzeichen,
        'blutentnahme_durchgefuehrt': _to_bool(bericht.blutentnahme_durchgefuehrt),
        'beschwerden_klagen': _txt(bericht.beschwerden_klagen),
        'handverletzung': _to_bool(bericht.handverletzung),
        'gebrauchshand': _txt(bericht.gebrauchshand),
        'klinische_befunde': _txt(bericht.klinische_befunde),
        'polytrauma': _to_bool(bericht.polytrauma),
        'iss_score': _txt(bericht.iss_score),
        
        # Diagnostik
        'bildgebende_diagnostik': _txt(bericht.bildgebende_diagnostik),
        'erstdiagnose_freitext': _txt(bericht.erstdiagnose_freitext),
        'erstdiagnose_icd10': _txt(bericht.erstdiagnose_icd10),
        'erstdiagnose_ao': _txt(bericht.erstdiagnose_ao),
        
        # Beurteilung
        'art_da_versorgung': _txt(bericht.art_da_versorgung),
        'vorerkrankungen': _txt(bericht.vorerkrankungen),
        
        # Zweifel
        'zweifel_arbeitsunfall': _to_bool(bericht.zweifel_arbeitsunfall),
        'zweifel_begruendung': _txt(bericht.zweifel_begruendung),
        
        # Heilbehandlung
        'heilbehandlung_art': _txt(bericht.heilbehandlung_art),
        'keine_heilbehandlung_grund': _txt(bericht.keine_heilbehandlung_grund),
        'verletzung_vav': _to_bool(bericht.verletzung_vav),
        'verletzung_vav_ziffer': _txt(bericht.verletzung_vav_ziffer),
        'verletzung_sav': _to_bool(bericht.verletzung_sav),
        'verletzung_sav_ziffer': _txt(bericht.verletzung_sav_ziffer),
        
        # Weiterbehandlung
        'weiterbehandlung_durch': _txt(bericht.weiterbehandlung_durch),
        'anderer_arzt_name': _txt(bericht.anderer_arzt_name),
        'anderer_arzt_adresse': _txt(bericht.anderer_arzt_adresse),
        
        # Arbeitsfähigkeit
        'arbeitsfaehig': _to_bool(bericht.arbeitsfaehig),
        'arbeitsunfaehig_ab': _txt(str(bericht.arbeitsunfaehig_ab) if bericht.arbeitsunfaehig_ab else None),
        'arbeitsfaehig_ab': _txt(str(bericht.arbeitsfaehig_ab) if bericht.arbeitsfaehig_ab else None),
        'au_laenger_3_monate': _to_bool(bericht.au_laenger_3_monate),
        
        # Weitere Ärzte
        'weitere_aerzte_noetig': _to_bool(bericht.weitere_aerzte_noetig),
        'weitere_aerzte_namen': _txt(bericht.weitere_aerzte_namen),
        
        # Wiedervorstellung
        'wiedervorstellung_datum': _txt(str(bericht.wiedervorstellung_datum) if bericht.wiedervorstellung_datum else None),
        'wiedervorstellung_mitgeteilt': _to_bool(bericht.wiedervorstellung_mitgeteilt),
        
        # Bemerkungen
        'bemerkungen': _txt(bericht.bemerkungen),
        'weitere_ausfuehrungen': _txt(bericht.weitere_ausfuehrungen),
        
        # Datenschutz
        'datenschutz_hinweis_gegeben': _to_bool(bericht.datenschutz_hinweis_gegeben),
        'mitteilung_behandelnder_arzt': _txt(bericht.mitteilung_behandelnder_arzt),
        'datum_mitteilung_behandelnder_arzt': _txt(str(bericht.datum_mitteilung_behandelnder_arzt) if bericht.datum_mitteilung_behandelnder_arzt else None),
        
        # Ergänzungsberichte
        'ergaenzung_kopfverletzung': _to_bool(bericht.ergaenzung_kopfverletzung),
        'ergaenzung_knieverletzung': _to_bool(bericht.ergaenzung_knieverletzung),
        'ergaenzung_schulterverletzung': _to_bool(bericht.ergaenzung_schulterverletzung),
        'ergaenzung_verbrennung': _to_bool(bericht.ergaenzung_verbrennung),
        
        # System
        'erstellt_am': _txt(str(bericht.erstellt_am) if bericht.erstellt_am else None),
    }

def _get_patient_data(patient: Patient) -> dict:
    """Konvertiert Patient-Model zu dict"""
    return {
        'id': patient.id,
        'vorname': patient.vorname,
        'nachname': patient.nachname,
        'geburtsdatum': _txt(str(patient.geburtsdatum) if patient.geburtsdatum else None),
        'geschlecht': _txt(patient.geschlecht),
        'telefon': _txt(patient.telefon),
        'staatsangehoerigkeit': _txt(patient.staatsangehoerigkeit),
        'strasse': _txt(patient.strasse),
        'plz': _txt(patient.plz),
        'ort': _txt(patient.ort),
        'familienversichert': _to_bool(patient.familienversichert),
        'familienversichert_name': _txt(patient.familienversichert_name),
        'pflegekasse': _txt(patient.pflegekasse),
        'beschaeftigt_als': _txt(patient.beschaeftigt_als),
        'beschaeftigt_seit': _txt(str(patient.beschaeftigt_seit) if patient.beschaeftigt_seit else None),
    }


def _get_arzt_data(arzt: Benutzer) -> dict:
    """Konvertiert Benutzer/Arzt-Model zu dict"""
    return {
        'id': arzt.id,
        'vorname': _txt(arzt.vorname),
        'nachname': _txt(arzt.nachname),
        'titel': _txt(arzt.titel),
        'durchgangsarzt_nr': _txt(arzt.durchgangsarzt_nr),
        'praxis_name': _txt(arzt.praxis_name),
        'praxis_strasse': _txt(arzt.praxis_strasse),
        'praxis_plz': _txt(arzt.praxis_plz),
        'praxis_ort': _txt(arzt.praxis_ort),
        'praxis_telefon': _txt(arzt.praxis_telefon),
    }


def _get_unfallbetrieb_data(ub: Optional[Unfallbetrieb]) -> Optional[dict]:
    """Konvertiert Unfallbetrieb-Model zu dict"""
    if not ub:
        return None
    return {
        'id': ub.id,
        'name': _txt(ub.name),
        'strasse': _txt(ub.strasse),
        'plz': _txt(ub.plz),
        'ort': _txt(ub.ort),
        'telefon': _txt(ub.telefon),
        'branche': _txt(ub.branche),
    }


def _get_uv_traeger_data(uv: Optional[UVTraeger]) -> Optional[dict]:
    """Konvertiert UV-Träger-Model zu dict"""
    if not uv:
        return None
    return {
        'id': uv.id,
        'name': _txt(uv.name),
        'kuerzel': _txt(uv.kuerzel),
        'adresse': _txt(uv.adresse),
        'telefon': _txt(uv.telefon),
        'email': _txt(uv.email),
    }


def _get_krankenkasse_data(kk: Optional[Krankenkasse]) -> Optional[dict]:
    """Konvertiert Krankenkasse-Model zu dict"""
    if not kk:
        return None
    return {
        'id': kk.id,
        'name': _txt(kk.name),
        'kuerzel': _txt(kk.kuerzel),
        'ik_nummer': _txt(kk.ik_nummer),
    }


@router.get("/{bericht_id}/pdf")
async def generate_pdf(
    bericht_id: int,
    typ: str = "uv",  # "uv" oder "kk"
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Generiert PDF für einen Bericht.
    
    - typ=uv: PDF für UV-Träger (vollständig)
    - typ=kk: PDF für Krankenkasse (reduziert)
    """
    # Bericht laden
    bericht = db.query(Bericht).filter(Bericht.id == bericht_id).first()
    if not bericht:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bericht nicht gefunden"
        )
    
    # Berechtigungsprüfung
    if bericht.benutzer_id != current_user.id and current_user.rolle != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Bericht"
        )
    
    # Patient laden
    patient = db.query(Patient).filter(Patient.id == bericht.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient nicht gefunden"
        )
    
    # Unfallbetrieb laden (optional)
    unfallbetrieb = None
    if bericht.unfallbetrieb_id:
        unfallbetrieb = db.query(Unfallbetrieb).filter(
            Unfallbetrieb.id == bericht.unfallbetrieb_id
        ).first()
    
    # UV-Träger laden (optional)
    uv_traeger = None
    if bericht.uv_traeger_id:
        uv_traeger = db.query(UVTraeger).filter(
            UVTraeger.id == bericht.uv_traeger_id
        ).first()
    
    # Krankenkasse laden (optional)
    krankenkasse = None
    if patient.krankenkasse_id:
        krankenkasse = db.query(Krankenkasse).filter(
            Krankenkasse.id == patient.krankenkasse_id
        ).first()
    
    # Daten konvertieren
    bericht_data = _get_bericht_data(bericht)
    patient_data = _get_patient_data(patient)
    arzt_data = _get_arzt_data(current_user)
    unfallbetrieb_data = _get_unfallbetrieb_data(unfallbetrieb)
    uv_traeger_data = _get_uv_traeger_data(uv_traeger)
    krankenkasse_data = _get_krankenkasse_data(krankenkasse)
    
    # PDF generieren
    generator = F1000PDFGenerator()
    
    if typ == "kk":
        pdf_buffer = generator.generate_krankenkasse_pdf(
            bericht=bericht_data,
            patient=patient_data,
            arzt=arzt_data,
            unfallbetrieb=unfallbetrieb_data,
            uv_traeger=uv_traeger_data,
            krankenkasse=krankenkasse_data
        )
        filename = f"{patient.nachname}-{patient.vorname}-dabform-kk.pdf"
    else:
        pdf_buffer = generator.generate_uv_traeger_pdf(
            bericht=bericht_data,
            patient=patient_data,
            arzt=arzt_data,
            unfallbetrieb=unfallbetrieb_data,
            uv_traeger=uv_traeger_data,
            krankenkasse=krankenkasse_data
        )
        filename = f"{patient.nachname}-{patient.vorname}-dabform.pdf"
    
    # Dateinamen bereinigen
    filename = filename.replace(" ", "_").replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/{bericht_id}/pdf/preview")
async def preview_pdf(
    bericht_id: int,
    typ: str = "uv",
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    PDF-Vorschau (inline im Browser öffnen statt Download)
    """
    # Gleiche Logik wie generate_pdf, aber Content-Disposition: inline
    bericht = db.query(Bericht).filter(Bericht.id == bericht_id).first()
    if not bericht:
        raise HTTPException(status_code=404, detail="Bericht nicht gefunden")
    
    if bericht.benutzer_id != current_user.id and current_user.rolle != "admin":
        raise HTTPException(status_code=403, detail="Keine Berechtigung")
    
    patient = db.query(Patient).filter(Patient.id == bericht.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient nicht gefunden")
    
    unfallbetrieb = None
    if bericht.unfallbetrieb_id:
        unfallbetrieb = db.query(Unfallbetrieb).filter(Unfallbetrieb.id == bericht.unfallbetrieb_id).first()
    
    uv_traeger = None
    if bericht.uv_traeger_id:
        uv_traeger = db.query(UVTraeger).filter(UVTraeger.id == bericht.uv_traeger_id).first()
    
    krankenkasse = None
    if patient.krankenkasse_id:
        krankenkasse = db.query(Krankenkasse).filter(Krankenkasse.id == patient.krankenkasse_id).first()
    
    bericht_data = _get_bericht_data(bericht)
    patient_data = _get_patient_data(patient)
    arzt_data = _get_arzt_data(current_user)
    unfallbetrieb_data = _get_unfallbetrieb_data(unfallbetrieb)
    uv_traeger_data = _get_uv_traeger_data(uv_traeger)
    krankenkasse_data = _get_krankenkasse_data(krankenkasse)
    
    generator = F1000PDFGenerator()
    
    if typ == "kk":
        pdf_buffer = generator.generate_krankenkasse_pdf(
            bericht=bericht_data,
            patient=patient_data,
            arzt=arzt_data,
            unfallbetrieb=unfallbetrieb_data,
            uv_traeger=uv_traeger_data,
            krankenkasse=krankenkasse_data
        )
    else:
        pdf_buffer = generator.generate_uv_traeger_pdf(
            bericht=bericht_data,
            patient=patient_data,
            arzt=arzt_data,
            unfallbetrieb=unfallbetrieb_data,
            uv_traeger=uv_traeger_data,
            krankenkasse=krankenkasse_data
        )
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline"
        }
    )
