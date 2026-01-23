import { z } from "zod";

const plzSchema = z.string().regex(/^\d{5}$/, "PLZ muss 5-stellig sein");
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum");
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Ungültige Uhrzeit");

const patientSchema = z.object({
  vorname: z.string().min(2, "Vorname muss mindestens 2 Zeichen haben"),
  nachname: z.string().min(2, "Nachname ist Pflicht"),
  geburtsdatum: dateSchema,
  geschlecht: z.string().min(1, "Bitte Geschlecht wählen"),

  telefon: z.string().min(1, "Telefonnummer ist Pflicht"),
  strasse: z.string().min(1, "Straße ist Pflicht"),
  plz: plzSchema,
  ort: z.string().min(1, "Ort ist Pflicht"),
  staatsangehoerigkeit: z.string().min(1, "Staatsangehörigkeit ist Pflicht"),

  beschaeftigt_als: z.string().min(1, "Tätigkeit ist Pflicht"),
  beschaeftigt_seit: dateSchema,

  familienversichert: z.boolean(),
  familienversichert_name: z.string().optional(),

  pflegekasse: z.string().optional(),
});

const krankenkasseSchema = z.object({
  name: z.string().min(1, "Name der Krankenkasse fehlt"),
  kuerzel: z.string().min(1, "Kürzel fehlt"),
  ik_nummer: z.string().min(1, "IK-Nummer fehlt"),
});

const unfallbetriebSchema = z.object({
  name: z.string().min(1, "Name des Betriebs fehlt"),
  strasse: z.string().min(1, "Straße fehlt"),
  plz: plzSchema,
  ort: z.string().min(1, "Ort fehlt"),
  telefon: z.string().min(1, "Telefon fehlt"),
  branche: z.string().min(1, "Branche fehlt"),
});

const uvTraegerSchema = z.object({
  name: z.string().min(1, "Name des UV-Trägers fehlt"),
  kuerzel: z.string().min(1, "Kürzel fehlt"),
  adresse: z.string().min(1, "Anschrift fehlt"),
  telefon: z.string().min(1, "Telefon fehlt"),
  email: z.string().min(1, "E-Mail fehlt").email("Ungültige E-Mail"),
  erstellt_am: z.string().optional(),
});

const berichtBaseSchema = z.object({
  ist_pflegeunfall: z.boolean().default(false),
  lfd_nr: z.string().min(1, "Lfd. Nr. fehlt"),

  erstellt_am: z.string().optional(),
  abgeschlossen_am: z.string().optional(),



  unfalltag: dateSchema,
  unfallzeit: timeSchema,
  arbeitszeit_beginn: timeSchema,
  arbeitszeit_ende: timeSchema,

  unfallort: z.string().min(1, "Unfallort fehlt"),
  unfallhergang: z.string().min(1, "Unfallhergang fehlt"),

  verhalten_nach_unfall: z.string().min(1, "Angabe zum Verhalten nach Unfall fehlt"),
  art_erstversorgung: z.string().min(1, "Art der Erstversorgung fehlt"),

  erstbehandlung_datum: dateSchema,
  erstbehandlung_durch: z.string().min(1, "Name des erstbehandelnden Arztes fehlt"),

  verdacht_alkohol_drogen: z.boolean(),
  alkohol_drogen_anzeichen: z.string().optional(),
  blutentnahme_durchgefuehrt: z.boolean(),

  beschwerden_klagen: z.string().min(1, "Klagen/Beschwerden fehlen"),
  klinische_befunde: z.string().min(1, "Klinische Befunde fehlen"),
  bildgebende_diagnostik: z.string().min(1, "Bildgebende Diagnostik fehlt"),
  erstdiagnose_freitext: z.string().min(1, "Erstdiagnose fehlt"),

  handverletzung: z.boolean(),
  gebrauchshand: z.string().optional(),

  polytrauma: z.boolean(),
  iss_score: z.string().optional(),

  ergaenzung_kopfverletzung: z.boolean(),
  ergaenzung_knieverletzung: z.boolean(),
  ergaenzung_schulterverletzung: z.boolean(),
  ergaenzung_verbrennung: z.boolean(),

  erstdiagnose_icd10: z.string().min(1, "ICD-10 Code fehlt"),
  erstdiagnose_ao: z.string().min(1, "AO-Klassifikation fehlt"),

  art_da_versorgung: z.string().min(1, "Art der Versorgung fehlt"),
  vorerkrankungen: z.string().min(1, "Vorerkrankungen fehlen (ggf. 'Keine' eingeben)"),

  zweifel_arbeitsunfall: z.boolean(),
  zweifel_begruendung: z.string().optional(),

  heilbehandlung_art: z.string().min(1, "Art der Heilbehandlung fehlt"),
  keine_heilbehandlung_grund: z.string().optional(),

  verletzung_vav: z.boolean(),
  verletzung_vav_ziffer: z.string().optional(),
  verletzung_sav: z.boolean(),
  verletzung_sav_ziffer: z.string().optional(),

  weiterbehandlung_durch: z.string().min(1, "Weiterbehandlung durch wen?"),
  anderer_arzt_name: z.string().optional(),
  anderer_arzt_adresse: z.string().optional(),

  arbeitsfaehig: z.boolean().nullable(),
  arbeitsunfaehig_ab: z.string().optional(),
  arbeitsfaehig_ab: z.string().optional(),
  au_laenger_3_monate: z.boolean(),

  weitere_aerzte_noetig: z.boolean(),
  weitere_aerzte_namen: z.string().optional(),

  wiedervorstellung_datum: dateSchema,
  wiedervorstellung_mitgeteilt: z.boolean(),

  bemerkungen: z.string().optional(),
  weitere_ausfuehrungen: z.string().optional(),

  mitteilung_behandelnder_arzt: z.string().min(1, "Name/Stempel ist Pflicht"),
  datum_mitteilung_behandelnder_arzt: dateSchema,
  datenschutz_hinweis_gegeben: z.boolean(),
});

{/** Schema für die ersten Schritte des Formulars */}

export const step1Schema = z.object({
  patient: patientSchema.pick({
    vorname: true,
    nachname: true,
    geburtsdatum: true,
    geschlecht: true,
    telefon: true,
    strasse: true,
    plz: true,
    ort: true,
    staatsangehoerigkeit: true,
    beschaeftigt_als: true,
    beschaeftigt_seit: true,
  }),
  bericht: z.object({
    lfd_nr: z.string().min(1),
  }),
});

{/** Schema für den zweiten Schritt des Formulars */}
export const step2Schema = z.object({
  krankenkasse: krankenkasseSchema.pick({
    name: true,
    kuerzel: true,
    ik_nummer: true,
  }),
  unfallbetrieb: unfallbetriebSchema.pick({
    name: true,
    strasse: true,
    plz: true,
    ort: true,
    telefon: true,
    branche: true,
  }),
  uv_traeger: uvTraegerSchema.pick({
    name: true,
    kuerzel: true,
    adresse: true,
    telefon: true,
    email: true,
  }),
  bericht: berichtBaseSchema.pick({
    ist_pflegeunfall:true,
  }),
  patient: patientSchema.pick({
    pflegekasse: true,
    familienversichert: true,
    familienversichert_name: true,
  }),
})
.superRefine((data, ctx) => {
    const b = data.bericht;
    const p = data.patient;

    // Pflegekasse
    if (b.ist_pflegeunfall && !p.pflegekasse?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bei Pflegeunfall ist die Pflegekasse Pflicht", path: ["patient", "pflegekasse"] });
    }
  });

{/** Schema für den dritten Schritt des Formulars */}
export const step3Schema = z.object({
  bericht: berichtBaseSchema.pick({
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
    beschwerden_klagen: true,
    klinische_befunde: true,
    bildgebende_diagnostik: true,
    erstdiagnose_freitext: true,
    }),

})
.superRefine((data, ctx) => {
    const b = data.bericht;

    // Alkohol
    if (b.verdacht_alkohol_drogen && !b.alkohol_drogen_anzeichen?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte Anzeichen angeben", path: ["bericht", "alkohol_drogen_anzeichen"] });
    }
  });

  const berichtDraftSchema = berichtBaseSchema.partial();

{/** Schema für den vierten Schritt des Formulars */}
export const step4Schema = z.object({

  bericht: berichtDraftSchema.pick({
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
    arbeitsfaehig: true,
    arbeitsunfaehig_ab: true,
    arbeitsfaehig_ab:true,
    au_laenger_3_monate: true,
    weiterbehandlung_durch: true,
    anderer_arzt_name: true,
    anderer_arzt_adresse: true,
    wiedervorstellung_datum: true,
    wiedervorstellung_mitgeteilt: true,
    weitere_aerzte_noetig: true,
    weitere_aerzte_namen: true,
    bemerkungen: true,
    }),
})
.superRefine((data, ctx) => {
    const b = data.bericht;

    // Handverletzung
    if (b.handverletzung && !b.gebrauchshand?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte Gebrauchshand angeben", path: ["bericht", "gebrauchshand"] });
    }

    // Polytrauma
    if (b.polytrauma && !b.iss_score?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte ISS-Score angeben", path: ["bericht", "iss_score"] });
    }

    // Zweifel
    if (b.zweifel_arbeitsunfall && !b.zweifel_begruendung?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte Zweifel begründen", path: ["bericht", "zweifel_begruendung"] });
    }

    // Heilbehandlung "keine"
    if (b.heilbehandlung_art === "keine" && !b.keine_heilbehandlung_grund?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte Begründung angeben", path: ["bericht", "keine_heilbehandlung_grund"] });
    }

    // VAV/SAV
    if (b.verletzung_vav && !b.verletzung_vav_ziffer?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "VAV-Ziffer fehlt", path: ["bericht", "verletzung_vav_ziffer"] });
    }
    if (b.verletzung_sav && !b.verletzung_sav_ziffer?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "SAV-Ziffer fehlt", path: ["bericht", "verletzung_sav_ziffer"] });
    }

    // Weiterbehandlung anderer Arzt
    if (b.weiterbehandlung_durch === "andere_arzt") {
      if (!b.anderer_arzt_name?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name fehlt", path: ["bericht", "anderer_arzt_name"] });
      if (!b.anderer_arzt_adresse?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Anschrift fehlt", path: ["bericht", "anderer_arzt_adresse"] });
    }

    // AU: Status muss gewählt sein
     if (data.bericht.arbeitsfaehig === false) {
    if (!data.bericht.arbeitsunfaehig_ab) {
      ctx.addIssue({
        path: ["bericht", "arbeitsunfaehig_ab"],
        message: "Pflichtfeld bei Arbeitsunfähigkeit",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.bericht.arbeitsfaehig_ab) {
      ctx.addIssue({
        path: ["bericht", "arbeitsfaehig_ab"],
        message: "Pflichtfeld bei Arbeitsunfähigkeit",
        code: z.ZodIssueCode.custom,
      });
    }
  }
    // Optional: Prognose Pflicht machen, wenn du willst:
    // if (b.arbeitsfaehig === false && !b.arbeitsfaehig_ab?.trim()) { ... }

    // Weitere Ärzte
    if (b.weitere_aerzte_noetig && !b.weitere_aerzte_namen?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bitte Namen/Fachgebiet angeben", path: ["bericht", "weitere_aerzte_namen"] });
    }

    // Wiedervorstellung mitgeteilt muss true sein
    if (b.wiedervorstellung_mitgeteilt !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Terminmitteilung muss bestätigt werden", path: ["bericht", "wiedervorstellung_mitgeteilt"] });
    }

    
  })

{/** Schema für den fünften Schritt des Formulars */}
export const step5Schema = z.object({
  bericht: berichtBaseSchema.pick({
    weitere_ausfuehrungen: true,
    mitteilung_behandelnder_arzt: true,
    datum_mitteilung_behandelnder_arzt: true,
    datenschutz_hinweis_gegeben: true, 
    ergaenzung_kopfverletzung: true,
    ergaenzung_knieverletzung: true,
    ergaenzung_schulterverletzung: true,
    ergaenzung_verbrennung: true,
    lfd_nr:true,
    unfalltag: true,   
  }),
  patient: patientSchema.pick({
    nachname: true,
    vorname: true,
    geburtsdatum: true,
  }),
})
.superRefine((data, ctx) => {
    const b = data.bericht;
    // Datenschutz muss true sein
    if (b.datenschutz_hinweis_gegeben !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Datenschutz-Hinweis muss bestätigt werden", path: ["bericht", "datenschutz_hinweis_gegeben"] });
    }
  });



export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;

export type ReportFormValues = {
    patient: z.infer<typeof patientSchema>;
    krankenkasse: z.infer<typeof krankenkasseSchema>;
    unfallbetrieb: z.infer<typeof unfallbetriebSchema>;
    uv_traeger: z.infer<typeof uvTraegerSchema>;
    bericht: z.infer<typeof berichtBaseSchema>;
};






  
