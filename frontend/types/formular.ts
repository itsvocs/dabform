// app/formular/types.ts
export interface FormularDraft {
    id?: string;  // Local storage ID für Entwurf
    berichtId?: number;  // Backend ID wenn bereits erstellt
    currentStep: number;
    lastSaved: string;
    data: FormularData;
  }
  
  export interface FormularData {
    // Patient (Step 1)
    patient: {
      id?: number;  // Wenn bestehender Patient ausgewählt
      vorname: string;
      nachname: string;
      geburtsdatum: string;
      geschlecht: string;
      telefon: string;
      strasse: string;
      plz: string;
      ort: string;
      staatsangehoerigkeit: string;
      beschaeftigt_als: string;
      beschaeftigt_seit: string;
      familienversichert: boolean;
      familienversichert_name: string;
    };
  
    // Bericht Grunddaten (Step 1)
    lfd_nr: string;
  
    // Unfalldaten (Step 2)
    unfalltag: string;
    unfallzeit: string;
    unfallort: string;
    arbeitszeit_beginn: string;
    arbeitszeit_ende: string;
  
    // Unfallhergang (Step 2)
    unfallhergang: string;
    verhalten_nach_unfall: string;
  
    // Erstversorgung (Step 2)
    art_erstversorgung: string;
    erstbehandlung_datum: string;
    erstbehandlung_durch: string;
  
    // Befund (Step 3)
    verdacht_alkohol_drogen: boolean;
    alkohol_drogen_anzeichen: string;
    blutentnahme_durchgefuehrt: boolean;
    beschwerden_klagen: string;
    klinische_befunde: string;
    bildgebende_diagnostik: string;
    erstdiagnose_freitext: string;
  
    // Spezielle Verletzungen (Step 3)
    handverletzung: boolean;
    gebrauchshand: string;
    polytrauma: boolean;
    iss_score: string;
  
    // Diagnose (Step 3)
    erstdiagnose_icd10: string;
    erstdiagnose_ao: string;
  
    // Beurteilung (Step 4)
    art_da_versorgung: string;
    vorerkrankungen: string;
    zweifel_arbeitsunfall: boolean;
    zweifel_begruendung: string;
  
    // Heilbehandlung (Step 4)
    heilbehandlung_art: string;
    keine_heilbehandlung_grund: string;
    verletzung_vav: boolean;
    verletzung_vav_ziffer: string;
    verletzung_sav: boolean;
    verletzung_sav_ziffer: string;
  
    // Weiterbehandlung (Step 4)
    weiterbehandlung_durch: string;
    anderer_arzt_name: string;
    anderer_arzt_adresse: string;
  
    // Arbeitsfähigkeit (Step 4)
    arbeitsfaehig: boolean | null;
    arbeitsunfaehig_ab: string;
    arbeitsfaehig_ab: string;
    au_laenger_3_monate: boolean;
  
    // Weitere Ärzte (Step 4)
    weitere_aerzte_noetig: boolean;
    weitere_aerzte_namen: string;
  
    // Wiedervorstellung (Step 4)
    wiedervorstellung_datum: string;
    wiedervorstellung_mitgeteilt: boolean;
  
    // Abschluss (Step 5)
    bemerkungen: string;
    weitere_ausfuehrungen: string;
    mitteilung_behandelnder_arzt: string;
    datenschutz_hinweis_gegeben: boolean;
  
    // Ergänzungsberichte
    ergaenzung_kopfverletzung: boolean;
    ergaenzung_knieverletzung: boolean;
    ergaenzung_schulterverletzung: boolean;
    ergaenzung_verbrennung: boolean;
  }
  
  export const defaultFormularData: FormularData = {
    patient: {
      vorname: '',
      nachname: '',
      geburtsdatum: '',
      geschlecht: '',
      telefon: '',
      strasse: '',
      plz: '',
      ort: '',
      staatsangehoerigkeit: '',
      beschaeftigt_als: '',
      beschaeftigt_seit: '',
      familienversichert: false,
      familienversichert_name: '',
    },
    lfd_nr: '',
    unfalltag: '',
    unfallzeit: '',
    unfallort: '',
    arbeitszeit_beginn: '',
    arbeitszeit_ende: '',
    unfallhergang: '',
    verhalten_nach_unfall: '',
    art_erstversorgung: '',
    erstbehandlung_datum: '',
    erstbehandlung_durch: '',
    verdacht_alkohol_drogen: false,
    alkohol_drogen_anzeichen: '',
    blutentnahme_durchgefuehrt: false,
    beschwerden_klagen: '',
    klinische_befunde: '',
    bildgebende_diagnostik: '',
    erstdiagnose_freitext: '',
    handverletzung: false,
    gebrauchshand: '',
    polytrauma: false,
    iss_score: '',
    erstdiagnose_icd10: '',
    erstdiagnose_ao: '',
    art_da_versorgung: '',
    vorerkrankungen: '',
    zweifel_arbeitsunfall: false,
    zweifel_begruendung: '',
    heilbehandlung_art: '',
    keine_heilbehandlung_grund: '',
    verletzung_vav: false,
    verletzung_vav_ziffer: '',
    verletzung_sav: false,
    verletzung_sav_ziffer: '',
    weiterbehandlung_durch: '',
    anderer_arzt_name: '',
    anderer_arzt_adresse: '',
    arbeitsfaehig: null,
    arbeitsunfaehig_ab: '',
    arbeitsfaehig_ab: '',
    au_laenger_3_monate: false,
    weitere_aerzte_noetig: false,
    weitere_aerzte_namen: '',
    wiedervorstellung_datum: '',
    wiedervorstellung_mitgeteilt: false,
    bemerkungen: '',
    weitere_ausfuehrungen: '',
    mitteilung_behandelnder_arzt: '',
    datenschutz_hinweis_gegeben: false,
    ergaenzung_kopfverletzung: false,
    ergaenzung_knieverletzung: false,
    ergaenzung_schulterverletzung: false,
    ergaenzung_verbrennung: false,
  };