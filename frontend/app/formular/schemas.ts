import { z } from "zod";

// ==========================================
// HELPER SCHEMAS
// ==========================================

const optionalString = z.string().trim().optional().or(z.literal(""));
const plzSchema = z.string().regex(/^\d{5}$/, "PLZ muss 5-stellig sein");
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum");
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Ungültige Uhrzeit");
const optionalDateSchema = dateSchema.or(z.literal("")).optional();
const optionalTimeSchema = timeSchema.or(z.literal("")).optional();

// ==========================================
// TEIL-SCHEMAS
// ==========================================

export const patientSchema = z.object({
  id: z.number().optional(),
  vorname: z.string().min(2, "Vorname fehlt"),
  nachname: z.string().min(2, "Nachname fehlt"),
  geburtsdatum: dateSchema,
  geschlecht: z.string().min(1, "Geschlecht wählen"),
  telefon: z.string().min(1, "Telefon fehlt"),
  strasse: z.string().min(1, "Straße fehlt"),
  plz: plzSchema,
  ort: z.string().min(1, "Ort fehlt"),
  staatsangehoerigkeit: z.string().min(1, "Staatsangeh. fehlt"),
  beschaeftigt_als: z.string().min(1, "Tätigkeit fehlt"),
  beschaeftigt_seit: optionalDateSchema,
  familienversichert: z.boolean().default(false),
  familienversichert_name: optionalString,
  pflegekasse: optionalString,
});

export const krankenkasseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name fehlt"),
  kuerzel: z.string().min(1, "Kürzel fehlt"),
  ik_nummer: z.string().min(1, "IK-Nummer fehlt"),
});

export const unfallbetriebSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name fehlt"),
  strasse: z.string().min(1, "Straße fehlt"),
  plz: plzSchema,
  ort: z.string().min(1, "Ort fehlt"),
  telefon: z.string().min(1, "Telefon fehlt"),
  branche: z.string().min(1, "Branche fehlt"),
});

export const uvTraegerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name fehlt"),
  kuerzel: z.string().min(1, "Kürzel fehlt"),
  adresse: z.string().min(1, "Adresse fehlt"),
  telefon: z.string().min(1, "Telefon fehlt"),
  email: z.email("Ungültige E-Mail").or(z.literal("")).optional(),
});

export const berichtSchema = z.object({
  id: z.number().optional(),
  lfd_nr: z.string().min(1, "Lfd. Nr. fehlt"),
  ist_pflegeunfall: z.boolean().default(false),

  // Unfalldaten
  unfalltag: dateSchema,
  unfallzeit: timeSchema,
  arbeitszeit_beginn: optionalTimeSchema,
  arbeitszeit_ende: optionalTimeSchema,
  unfallort: z.string().min(1, "Unfallort fehlt"),
  unfallhergang: z.string().min(1, "Hergang fehlt"),
  verhalten_nach_unfall: z.string().min(1, "Angabe fehlt"),

  // Erstversorgung
  art_erstversorgung: z.string().min(1, "Angabe fehlt"),
  erstbehandlung_datum: dateSchema,
  erstbehandlung_durch: z.string().min(1, "Arzt fehlt"),

  // Befund
  verdacht_alkohol_drogen: z.boolean().default(false),
  alkohol_drogen_anzeichen: optionalString,
  blutentnahme_durchgefuehrt: z.boolean().default(false),
  klinische_befunde: optionalString,
  bildgebende_diagnostik: optionalString,
  erstdiagnose_freitext: optionalString,
  beschwerden_klagen: optionalString,

  // Spezielle Verletzungen
  handverletzung: z.boolean().default(false),
  gebrauchshand: optionalString,
  polytrauma: z.boolean().default(false),
  iss_score: optionalString,

  // Ergänzungsberichte
  ergaenzung_kopfverletzung: z.boolean().default(false),
  ergaenzung_knieverletzung: z.boolean().default(false),
  ergaenzung_schulterverletzung: z.boolean().default(false),
  ergaenzung_verbrennung: z.boolean().default(false),

  // Diagnose Codes
  erstdiagnose_icd10: optionalString,
  erstdiagnose_ao: optionalString,

  // Beurteilung
  art_da_versorgung: z.string().min(1, "Versorgungsart fehlt"),
  vorerkrankungen: z.string().min(1, "Vorerkrankungen fehlen"),

  // Zweifel
  zweifel_arbeitsunfall: z.boolean().default(false),
  zweifel_begruendung: optionalString,

  // Heilbehandlung
  heilbehandlung_art: z.string().min(1, "Heilbehandlung fehlt"),
  keine_heilbehandlung_grund: optionalString,
  verletzung_vav: z.boolean().default(false),
  verletzung_vav_ziffer: optionalString,
  verletzung_sav: z.boolean().default(false),
  verletzung_sav_ziffer: optionalString,

  // Weiterbehandlung
  weiterbehandlung_durch: z.string().min(1, "Weiterbehandlung fehlt"),
  anderer_arzt_name: optionalString,
  anderer_arzt_adresse: optionalString,

  // Arbeitsfähigkeit
  arbeitsfaehig: z.boolean().nullable().optional(),
  arbeitsunfaehig_ab: optionalDateSchema,
  arbeitsfaehig_ab: optionalDateSchema,
  au_laenger_3_monate: z.boolean().default(false),

  // Weitere Ärzte
  weitere_aerzte_noetig: z.boolean().default(false),
  weitere_aerzte_namen: optionalString,

  // Wiedervorstellung
  wiedervorstellung_datum: dateSchema,
  wiedervorstellung_mitgeteilt: z.boolean().default(false),

  // Bemerkungen
  bemerkungen: optionalString,

  // Abschluss
  weitere_ausfuehrungen: optionalString,
  mitteilung_behandelnder_arzt: optionalString,
  datum_mitteilung_behandelnder_arzt: optionalDateSchema,
  datenschutz_hinweis_gegeben: z.boolean().default(false),
});

// ==========================================
// STEP SCHEMAS
// ==========================================

export const step1Schema = z.object({
  patient: patientSchema,
  bericht: z.object({ 
    lfd_nr: z.string().min(1, "Lfd. Nr. fehlt") 
  }),
});

export const step2Schema = z.object({
  krankenkasse: krankenkasseSchema,
  unfallbetrieb: unfallbetriebSchema,
  uv_traeger: uvTraegerSchema,
  bericht: z.object({ ist_pflegeunfall: z.boolean() }),
  patient: z.object({ 
    pflegekasse: optionalString, 
    familienversichert: z.boolean(),
    familienversichert_name: optionalString 
  }),
}).superRefine((data, ctx) => {
  if (data.bericht.ist_pflegeunfall && !data.patient.pflegekasse) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "Pflichtfeld", 
      path: ["patient", "pflegekasse"] 
    });
  }
  if (data.patient.familienversichert && !data.patient.familienversichert_name) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "Pflichtfeld", 
      path: ["patient", "familienversichert_name"] 
    });
  }
});

export const step3Schema = z.object({
  bericht: berichtSchema.pick({
    unfalltag: true,
    unfallzeit: true,
    arbeitszeit_beginn: true,
    arbeitszeit_ende: true,
    unfallort: true,
    unfallhergang: true,
    verhalten_nach_unfall: true,
    art_erstversorgung: true,
    erstbehandlung_datum: true,
    erstbehandlung_durch: true,
    verdacht_alkohol_drogen: true,
    alkohol_drogen_anzeichen: true,
    blutentnahme_durchgefuehrt: true,
    klinische_befunde: true,
    bildgebende_diagnostik: true,
    erstdiagnose_freitext: true,
  }),
}).superRefine((data, ctx) => {
  if (data.bericht.verdacht_alkohol_drogen && !data.bericht.alkohol_drogen_anzeichen) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Anzeichen angeben",
      path: ["bericht", "alkohol_drogen_anzeichen"],
    });
  }
});

export const step4Schema = z.object({
  bericht: berichtSchema.pick({
    handverletzung: true,
    gebrauchshand: true,
    polytrauma: true,
    iss_score: true,
    ergaenzung_kopfverletzung: true,
    ergaenzung_knieverletzung: true,
    ergaenzung_schulterverletzung: true,
    ergaenzung_verbrennung: true,
    erstdiagnose_icd10: true,
    erstdiagnose_ao: true,
    art_da_versorgung: true,
    vorerkrankungen: true,
    zweifel_arbeitsunfall: true,
    zweifel_begruendung: true,
    heilbehandlung_art: true,
    keine_heilbehandlung_grund: true,
    verletzung_vav: true,
    verletzung_vav_ziffer: true,
    verletzung_sav: true,
    verletzung_sav_ziffer: true,
    weiterbehandlung_durch: true,
    anderer_arzt_name: true,
    anderer_arzt_adresse: true,
    arbeitsfaehig: true,
    arbeitsunfaehig_ab: true,
    arbeitsfaehig_ab: true,
    au_laenger_3_monate: true,
    weitere_aerzte_noetig: true,
    weitere_aerzte_namen: true,
    wiedervorstellung_datum: true,
    wiedervorstellung_mitgeteilt: true,
    bemerkungen: true,
  }),
}).superRefine((data, ctx) => {
  const b = data.bericht;

  // Harte Pflichtfelder
  if (!b.art_da_versorgung) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Versorgungsart fehlt", path: ["bericht", "art_da_versorgung"] });
  }
  if (!b.vorerkrankungen) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Angabe fehlt", path: ["bericht", "vorerkrankungen"] });
  }
  if (!b.heilbehandlung_art) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Wählen Sie eine Art", path: ["bericht", "heilbehandlung_art"] });
  }
  if (!b.weiterbehandlung_durch) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Auswahl fehlt", path: ["bericht", "weiterbehandlung_durch"] });
  }
  if (!b.wiedervorstellung_datum) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Datum fehlt", path: ["bericht", "wiedervorstellung_datum"] });
  }
  if (b.arbeitsfaehig === null || b.arbeitsfaehig === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Status wählen", path: ["bericht", "arbeitsfaehig"] });
  }

  // Bedingte Pflichtfelder
  const isSevereInjury = b.handverletzung || b.polytrauma;
  if (isSevereInjury) {
    if (!b.erstdiagnose_icd10) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ICD fehlt", path: ["bericht", "erstdiagnose_icd10"] });
    if (!b.erstdiagnose_ao) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "AO fehlt", path: ["bericht", "erstdiagnose_ao"] });
  }

  if (b.handverletzung && !b.gebrauchshand) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gebrauchshand wählen", path: ["bericht", "gebrauchshand"] });
  }

  if (b.polytrauma && !b.iss_score) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ISS-Score fehlt", path: ["bericht", "iss_score"] });
  }

  if (b.zweifel_arbeitsunfall && !b.zweifel_begruendung) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Begründung fehlt", path: ["bericht", "zweifel_begruendung"] });
  }

  if (b.heilbehandlung_art === "keine" && !b.keine_heilbehandlung_grund) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Begründung fehlt", path: ["bericht", "keine_heilbehandlung_grund"] });
  }

  if (b.verletzung_vav && !b.verletzung_vav_ziffer) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ziffer fehlt", path: ["bericht", "verletzung_vav_ziffer"] });
  }

  if (b.verletzung_sav && !b.verletzung_sav_ziffer) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ziffer fehlt", path: ["bericht", "verletzung_sav_ziffer"] });
  }

  if (b.weiterbehandlung_durch === "andere_arzt") {
    if (!b.anderer_arzt_name) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name fehlt", path: ["bericht", "anderer_arzt_name"] });
    if (!b.anderer_arzt_adresse) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Anschrift fehlt", path: ["bericht", "anderer_arzt_adresse"] });
  }

  if (b.arbeitsfaehig === false) {
    if (!b.arbeitsunfaehig_ab) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Datum fehlt", path: ["bericht", "arbeitsunfaehig_ab"] });
    if (!b.arbeitsfaehig_ab) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Datum fehlt", path: ["bericht", "arbeitsfaehig_ab"] });
  }

  if (b.weitere_aerzte_noetig && !b.weitere_aerzte_namen) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name/Fachgebiet fehlt", path: ["bericht", "weitere_aerzte_namen"] });
  }

  if (!b.wiedervorstellung_mitgeteilt) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte bestätigen", path: ["bericht", "wiedervorstellung_mitgeteilt"] });
  }
});

export const step5Schema = z.object({
  bericht: berichtSchema.pick({
    weitere_ausfuehrungen: true,
    mitteilung_behandelnder_arzt: true,
    datum_mitteilung_behandelnder_arzt: true,
    datenschutz_hinweis_gegeben: true,
    lfd_nr: true,
    unfalltag: true,
    ergaenzung_kopfverletzung: true,
    ergaenzung_knieverletzung: true,
    ergaenzung_schulterverletzung: true,
    ergaenzung_verbrennung: true,
  }),
  patient: patientSchema.pick({ 
    nachname: true, 
    vorname: true, 
    geburtsdatum: true 
  }),
}).superRefine((data, ctx) => {
  if (!data.bericht.datenschutz_hinweis_gegeben) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "Pflichtfeld", 
      path: ["bericht", "datenschutz_hinweis_gegeben"] 
    });
  }
  if (!data.bericht.datum_mitteilung_behandelnder_arzt) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "Datum fehlt", 
      path: ["bericht", "datum_mitteilung_behandelnder_arzt"] 
    });
  }
  if (!data.bericht.mitteilung_behandelnder_arzt) {
    ctx.addIssue({ 
      code: z.ZodIssueCode.custom, 
      message: "Angaben fehlen", 
      path: ["bericht", "mitteilung_behandelnder_arzt"] 
    });
  }
});

// Full Schema
export const fullReportSchema = z.object({
  patient: patientSchema,
  krankenkasse: krankenkasseSchema,
  unfallbetrieb: unfallbetriebSchema,
  uv_traeger: uvTraegerSchema,
  bericht: berichtSchema,
});

// Types
export type ReportFormValues = z.infer<typeof fullReportSchema>;
export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;
