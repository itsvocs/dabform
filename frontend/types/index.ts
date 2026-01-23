export interface User {
  id: number;
  email: string;
  vorname: string;
  nachname: string;
  titel?: string;
  rolle: "arzt" | "admin";
  aktiv: boolean;
  
  durchgangsarzt_nr?: string;
  praxis_name?: string;
  praxis_strasse?: number;
  praxis_plz?: string;
  praxis_ort?: string;
  praxis_telefon?: string;
  erstellt_am: string;
  aktualisiert_am?: string;
}

export interface Patient {
  id: number;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht?:  string;
  telefon?: string;
  staatsangehoerigkeit?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  krankenkasse_id?: number;
  familienversichert?: boolean;
  beschaeftigt_als?: string;
  erstellt_am: string;
}

export interface PatientCreate {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht: string;
  telefon?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  staatsangehoerigkeit?: string;
  beschaeftigt_als?: string;
  // beschaeftigt_seit?: string;
  familienversichert?: boolean;
  familienversichert_name?: string;
}


export interface Bericht {
  id: number;
  lfd_nr: string;
  patient_id: number;
  benutzer_id: number;
  unfalltag: string;
  unfallzeit?: string;
  unfallort?: string;
  unfallhergang?: string;
  status: "entwurf" | "abgeschlossen";
  beschwerden_klagen?: string;
  erstdiagnose_freitext?: string;
  erstellt_am: string;
  aktualisiert_am?: string;
  abgeschlossen_am?: string;
}


export interface Bericht {
  // Meta
  id: number;
  lfd_nr: string;
  benutzer_id: number;
  patient_id: number;
  uv_traeger_id?: number;
  unfallbetrieb_id?: number;
  status: 'entwurf' | 'abgeschlossen';
  eingetroffen_datum?: string;
  eingetroffen_uhrzeit?: string;
  kopie_an_kasse: boolean;

  // Abschnitt 1: Unfalldaten
  unfalltag: string;
  unfallzeit?: string;
  unfallort?: string;
  arbeitszeit_beginn?: string;
  arbeitszeit_ende?: string;

  // Abschnitt 2: Unfallhergang
  unfallhergang?: string;
  taetigkeit_bei_unfall?: string;

  // Abschnitt 3: Verhalten nach Unfall
  verhalten_nach_unfall?: string;

  // Abschnitt 4: Erstversorgung
  art_erstversorgung?: string;
  erstbehandlung_datum?: string;
  erstbehandlung_durch?: string;

  // Abschnitt 5: Befund
  verdacht_alkohol_drogen: boolean;
  alkohol_drogen_anzeichen?: string;
  blutentnahme_durchgefuehrt: boolean;
  beschwerden_klagen?: string;
  handverletzung: boolean;
  gebrauchshand?: string;
  klinische_befunde?: string;
  polytrauma: boolean;
  iss_score?: number;

  // Abschnitt 6: Bildgebende Diagnostik
  bildgebende_diagnostik?: string;

  // Abschnitt 7: Erstdiagnose
  erstdiagnose_freitext?: string;
  erstdiagnose_icd10?: string;
  erstdiagnose_ao?: string;

  // Abschnitt 8: D-Ärztliche Versorgung
  art_da_versorgung?: string;

  // Abschnitt 9: Vorerkrankungen
  vorerkrankungen?: string;

  // Abschnitt 10: Zweifel an Arbeitsunfall
  zweifel_arbeitsunfall: boolean;
  zweifel_begruendung?: string;

  // Abschnitt 11: Heilbehandlung
  heilbehandlung_art?: string;
  keine_heilbehandlung_grund?: string;
  verletzung_vav: boolean;
  verletzung_vav_ziffer?: string;
  verletzung_sav: boolean;
  verletzung_sav_ziffer?: string;

  // Abschnitt 12: Weiterbehandlung
  weiterbehandlung_durch?: string;
  anderer_arzt_name?: string;
  anderer_arzt_adresse?: string;

  // Abschnitt 13: Arbeitsfähigkeit
  arbeitsfaehig?: boolean;
  arbeitsunfaehig_ab?: string;
  arbeitsfaehig_ab?: string;
  au_laenger_3_monate: boolean;

  // Abschnitt 14: Weitere Ärzte
  weitere_aerzte_noetig: boolean;
  weitere_aerzte_namen?: string;

  // Abschnitt 15: Wiedervorstellung
  wiedervorstellung_datum?: string;
  wiedervorstellung_mitgeteilt: boolean;

  // Abschnitt 16: Bemerkungen
  bemerkungen?: string;

  // Seite 2
  weitere_ausfuehrungen?: string;

  // Datenschutz
  datenschutz_hinweis_gegeben: boolean;
  mitteilung_behandelnder_arzt?: string;

  // Ergänzungsberichte
  ergaenzung_kopfverletzung: boolean;
  ergaenzung_knieverletzung: boolean;
  ergaenzung_schulterverletzung: boolean;
  ergaenzung_verbrennung: boolean;

  // System
  erstellt_am: string;
  aktualisiert_am?: string;
  abgeschlossen_am?: string;
  pdf_generiert_am?: string;
}

export interface BerichtCreate {
  lfd_nr: string;
  patient_id: number;
  unfalltag: string;
  status?: 'entwurf' | 'abgeschlossen';
  
  // Alle optionalen Felder
  uv_traeger_id?: number;
  unfallbetrieb_id?: number;
  eingetroffen_datum?: string;
  eingetroffen_uhrzeit?: string;
  kopie_an_kasse?: boolean;
  unfallzeit?: string;
  unfallort?: string;
  arbeitszeit_beginn?: string;
  arbeitszeit_ende?: string;
  unfallhergang?: string;
  taetigkeit_bei_unfall?: string;
  verhalten_nach_unfall?: string;
  art_erstversorgung?: string;
  erstbehandlung_datum?: string;
  erstbehandlung_durch?: string;
  verdacht_alkohol_drogen?: boolean;
  alkohol_drogen_anzeichen?: string;
  blutentnahme_durchgefuehrt?: boolean;
  beschwerden_klagen?: string;
  handverletzung?: boolean;
  gebrauchshand?: string;
  klinische_befunde?: string;
  polytrauma?: boolean;
  iss_score?: number;
  bildgebende_diagnostik?: string;
  erstdiagnose_freitext?: string;
  erstdiagnose_icd10?: string;
  erstdiagnose_ao?: string;
  art_da_versorgung?: string;
  vorerkrankungen?: string;
  zweifel_arbeitsunfall?: boolean;
  zweifel_begruendung?: string;
  heilbehandlung_art?: string;
  keine_heilbehandlung_grund?: string;
  verletzung_vav?: boolean;
  verletzung_vav_ziffer?: string;
  verletzung_sav?: boolean;
  verletzung_sav_ziffer?: string;
  weiterbehandlung_durch?: string;
  anderer_arzt_name?: string;
  anderer_arzt_adresse?: string;
  arbeitsfaehig?: boolean;
  arbeitsunfaehig_ab?: string;
  arbeitsfaehig_ab?: string;
  au_laenger_3_monate?: boolean;
  weitere_aerzte_noetig?: boolean;
  weitere_aerzte_namen?: string;
  wiedervorstellung_datum?: string;
  wiedervorstellung_mitgeteilt?: boolean;
  bemerkungen?: string;
  weitere_ausfuehrungen?: string;
  datenschutz_hinweis_gegeben?: boolean;
  mitteilung_behandelnder_arzt?: string;
  ergaenzung_kopfverletzung?: boolean;
  ergaenzung_knieverletzung?: boolean;
  ergaenzung_schulterverletzung?: boolean;
  ergaenzung_verbrennung?: boolean;
}

export type BerichtUpdate = Partial<BerichtCreate>;

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
