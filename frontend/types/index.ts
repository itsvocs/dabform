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
  praxis_telefon?: string;
  erstellt_am: string;
  aktualisiert_am?: string;
}

export interface Patient {
  id: number;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht?: "m" | "w" | "d";
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

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
