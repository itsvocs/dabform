"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  useRouter,
  //  useSearchParams 
} from "next/navigation";
import type { ZodIssue, ZodTypeAny } from "zod";
import {
  // fullReportSchema,
  ReportFormValues,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "./schemas";
import {
  berichteApi,
  krankenkassenApi,
  patientenApi,
  pdfApi,
  // krankenkassenApi,
  unfallbetriebeApi,
  uvTraegerApi,
} from "@/lib/api";
import type { BerichtCreate, BerichtUpdate } from "@/types";

// Step Forms
import { Step1Form } from "./Step1Form";
import { Step3Form } from "./Step3Form";
import { Step4Form } from "./Step4Form";
import { Step5Form } from "./Step5Form";

// UI Components
import { Button } from "@/components/ui/button";
import { Loader2, Save, ChevronLeft, ChevronRight, FileText, Check } from "lucide-react";
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
import { Spinner } from "@/components/ui/spinner";
import { toastManager } from "@/components/ui/toast";
import { Step2Form } from "./Step2FormComponent";

// Step Schemas Mapping
const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
};

const steps = [
  { id: 1, label: "Basisdaten" },
  { id: 2, label: "Versicherung" },
  { id: 3, label: "Unfall" },
  { id: 4, label: "Diagnose" },
  { id: 5, label: "Abschluss" },
];

// Default Form Values
const defaultValues: ReportFormValues = {
  patient: {
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    geschlecht: "",
    telefon: "",
    staatsangehoerigkeit: "",
    strasse: "",
    plz: "",
    ort: "",
    beschaeftigt_als: "",
    beschaeftigt_seit: "",
    familienversichert: false,
    familienversichert_name: "",
    pflegekasse: "",
  },
  krankenkasse: {
    name: "",
    kuerzel: "",
    ik_nummer: "",
  },
  unfallbetrieb: {
    name: "",
    strasse: "",
    plz: "",
    ort: "",
    telefon: "",
    branche: "",
  },
  uv_traeger: {
    name: "",
    kuerzel: "",
    adresse: "",
    telefon: "",
    email: "",
  },
  bericht: {
    lfd_nr: "",
    ist_pflegeunfall: false,
    unfalltag: "",
    unfallzeit: "",
    arbeitszeit_beginn: "",
    arbeitszeit_ende: "",
    unfallort: "",
    unfallhergang: "",
    verhalten_nach_unfall: "",
    art_erstversorgung: "",
    erstbehandlung_datum: "",
    erstbehandlung_durch: "",
    verdacht_alkohol_drogen: false,
    alkohol_drogen_anzeichen: "",
    blutentnahme_durchgefuehrt: false,
    klinische_befunde: "",
    bildgebende_diagnostik: "",
    erstdiagnose_freitext: "",
    beschwerden_klagen: "",
    handverletzung: false,
    gebrauchshand: "",
    polytrauma: false,
    iss_score: "",
    ergaenzung_kopfverletzung: false,
    ergaenzung_knieverletzung: false,
    ergaenzung_schulterverletzung: false,
    ergaenzung_verbrennung: false,
    erstdiagnose_icd10: "",
    erstdiagnose_ao: "",
    art_da_versorgung: "",
    vorerkrankungen: "",
    zweifel_arbeitsunfall: false,
    zweifel_begruendung: "",
    heilbehandlung_art: "",
    keine_heilbehandlung_grund: "",
    verletzung_vav: false,
    verletzung_vav_ziffer: "",
    verletzung_sav: false,
    verletzung_sav_ziffer: "",
    weiterbehandlung_durch: "",
    anderer_arzt_name: "",
    anderer_arzt_adresse: "",
    arbeitsfaehig: null,
    arbeitsunfaehig_ab: "",
    arbeitsfaehig_ab: "",
    au_laenger_3_monate: false,
    weitere_aerzte_noetig: false,
    weitere_aerzte_namen: "",
    wiedervorstellung_datum: "",
    wiedervorstellung_mitgeteilt: false,
    bemerkungen: "",
    weitere_ausfuehrungen: "",
    mitteilung_behandelnder_arzt: "",
    datum_mitteilung_behandelnder_arzt: "",
    datenschutz_hinweis_gegeben: false,
  },
};

interface FormularPageProps {
  berichtId?: number;
}

export default function FormularPage({ berichtId }: FormularPageProps) {
  const router = useRouter();
  // const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBericht, setIsLoadingBericht] = useState(!!berichtId);
  // const [loadingPDF, setLoadingPDF] = useState(false)

  // IDs für verknüpfte Entities
  const [patientId, setPatientId] = useState<number | null>(null);
  const [krankenkasseId, setKrankenkasseId] = useState<number | null>(null);
  const [unfallbetriebId, setUnfallbetriebId] = useState<number | null>(null);
  const [uvTraegerId, setUvTraegerId] = useState<number | null>(null);
  const [currentBerichtId, setCurrentBerichtId] = useState<number | null>(berichtId || null);

  const form = useForm<ReportFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, setError, getValues, setValue } = form;

  //  BERICHT LADEN (für Edit) 
  const loadBericht = useCallback(async (id: number) => {
    setIsLoadingBericht(true);
    try {
      const bericht = await berichteApi.getById(id);

      // Patient laden
      if (bericht.patient_id) {
        const patient = await patientenApi.getById(bericht.patient_id);
        setPatientId(patient.id);
        setValue("patient", {
          id: patient.id,
          vorname: patient.vorname,
          nachname: patient.nachname,
          geburtsdatum: patient.geburtsdatum,
          geschlecht: patient.geschlecht || "",
          telefon: patient.telefon || "",
          staatsangehoerigkeit: patient.staatsangehoerigkeit || "",
          strasse: patient.strasse || "",
          plz: patient.plz || "",
          ort: patient.ort || "",
          beschaeftigt_als: patient.beschaeftigt_als || "",
          beschaeftigt_seit: patient.beschaeftigt_seit || "",
          familienversichert: patient.familienversichert || false,
          familienversichert_name: patient.familienversichert_name || "",
          pflegekasse: patient.pflegekasse || "",
        });
      }

      // Krankenkasse, Unfallbetrieb, UV-Träger laden (wenn IDs vorhanden)
      if (bericht.uv_traeger_id) {
        try {
          const uvTraeger = await uvTraegerApi.getById(bericht.uv_traeger_id);
          setUvTraegerId(uvTraeger.id);
          setValue("uv_traeger", {
            id: uvTraeger.id,
            name: uvTraeger.name,
            kuerzel: uvTraeger.kuerzel,
            adresse: uvTraeger.adresse || "",
            telefon: uvTraeger.telefon || "",
            email: uvTraeger.email || "",
          });
        } catch (e) {
          console.log("UV-Träger nicht gefunden: ", e);

        }
      }

      if (bericht.unfallbetrieb_id) {
        try {
          const unfallbetrieb = await unfallbetriebeApi.getById(bericht.unfallbetrieb_id);
          setUnfallbetriebId(unfallbetrieb.id);
          setValue("unfallbetrieb", {
            id: unfallbetrieb.id,
            name: unfallbetrieb.name,
            strasse: unfallbetrieb.strasse || "",
            plz: unfallbetrieb.plz || "",
            ort: unfallbetrieb.ort || "",
            telefon: unfallbetrieb.telefon || "",
            branche: unfallbetrieb.branche || "",
          });
        } catch (e) {
          console.log("Unfallbetrieb nicht gefunden", e);
        }
      }

      // Bericht-Felder setzen
      setValue("bericht", {
        id: bericht.id,
        lfd_nr: bericht.lfd_nr,
        ist_pflegeunfall: bericht.ist_pflegeunfall || false,
        unfalltag: bericht.unfalltag,
        unfallzeit: bericht.unfallzeit || "",
        arbeitszeit_beginn: bericht.arbeitszeit_beginn || "",
        arbeitszeit_ende: bericht.arbeitszeit_ende || "",
        unfallort: bericht.unfallort || "",
        unfallhergang: bericht.unfallhergang || "",
        verhalten_nach_unfall: bericht.verhalten_nach_unfall || "",
        art_erstversorgung: bericht.art_erstversorgung || "",
        erstbehandlung_datum: bericht.erstbehandlung_datum || "",
        erstbehandlung_durch: bericht.erstbehandlung_durch || "",
        verdacht_alkohol_drogen: bericht.verdacht_alkohol_drogen || false,
        alkohol_drogen_anzeichen: bericht.alkohol_drogen_anzeichen || "",
        blutentnahme_durchgefuehrt: bericht.blutentnahme_durchgefuehrt || false,
        klinische_befunde: bericht.klinische_befunde || "",
        bildgebende_diagnostik: bericht.bildgebende_diagnostik || "",
        erstdiagnose_freitext: bericht.erstdiagnose_freitext || "",
        beschwerden_klagen: bericht.beschwerden_klagen || "",
        handverletzung: bericht.handverletzung || false,
        gebrauchshand: bericht.gebrauchshand || "",
        polytrauma: bericht.polytrauma || false,
        iss_score: bericht.iss_score?.toString() || "",
        ergaenzung_kopfverletzung: bericht.ergaenzung_kopfverletzung || false,
        ergaenzung_knieverletzung: bericht.ergaenzung_knieverletzung || false,
        ergaenzung_schulterverletzung: bericht.ergaenzung_schulterverletzung || false,
        ergaenzung_verbrennung: bericht.ergaenzung_verbrennung || false,
        erstdiagnose_icd10: bericht.erstdiagnose_icd10 || "",
        erstdiagnose_ao: bericht.erstdiagnose_ao || "",
        art_da_versorgung: bericht.art_da_versorgung || "",
        vorerkrankungen: bericht.vorerkrankungen || "",
        zweifel_arbeitsunfall: bericht.zweifel_arbeitsunfall || false,
        zweifel_begruendung: bericht.zweifel_begruendung || "",
        heilbehandlung_art: bericht.heilbehandlung_art || "",
        keine_heilbehandlung_grund: bericht.keine_heilbehandlung_grund || "",
        verletzung_vav: bericht.verletzung_vav || false,
        verletzung_vav_ziffer: bericht.verletzung_vav_ziffer || "",
        verletzung_sav: bericht.verletzung_sav || false,
        verletzung_sav_ziffer: bericht.verletzung_sav_ziffer || "",
        weiterbehandlung_durch: bericht.weiterbehandlung_durch || "",
        anderer_arzt_name: bericht.anderer_arzt_name || "",
        anderer_arzt_adresse: bericht.anderer_arzt_adresse || "",
        arbeitsfaehig: bericht.arbeitsfaehig ?? null,
        arbeitsunfaehig_ab: bericht.arbeitsunfaehig_ab || "",
        arbeitsfaehig_ab: bericht.arbeitsfaehig_ab || "",
        au_laenger_3_monate: bericht.au_laenger_3_monate || false,
        weitere_aerzte_noetig: bericht.weitere_aerzte_noetig || false,
        weitere_aerzte_namen: bericht.weitere_aerzte_namen || "",
        wiedervorstellung_datum: bericht.wiedervorstellung_datum || "",
        wiedervorstellung_mitgeteilt: bericht.wiedervorstellung_mitgeteilt || false,
        bemerkungen: bericht.bemerkungen || "",
        weitere_ausfuehrungen: bericht.weitere_ausfuehrungen || "",
        mitteilung_behandelnder_arzt: bericht.mitteilung_behandelnder_arzt || "",
        datum_mitteilung_behandelnder_arzt: bericht.datum_mitteilung_behandelnder_arzt || "",
        datenschutz_hinweis_gegeben: bericht.datenschutz_hinweis_gegeben || false,
      });

      setCurrentBerichtId(bericht.id);

      // toastManager.add({
      //   title: "Bericht geladen",
      //   description: `Entwurf "${bericht.lfd_nr}" wurde geladen.`,
      //   type: "info"
      // });
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      toastManager.add({
        title: "Fehler",
        description: "Bericht konnte nicht geladen werden.",
        type: "error",
      });
    } finally {
      setIsLoadingBericht(false);
    }
  }, [setValue]);

  // Beim Mount: Bericht laden falls ID vorhanden
  useEffect(() => {
    if (berichtId) {
      loadBericht(berichtId);
    }
  }, [berichtId, loadBericht]);

  //  ENTITIES ERSTELLEN/AKTUALISIEREN 
  const savePatient = async (): Promise<number> => {
    const patientData = getValues("patient");

    if (patientId) {
      // Existierenden Patienten aktualisieren
      await patientenApi.update(patientId, {
        vorname: patientData.vorname,
        nachname: patientData.nachname,
        geburtsdatum: patientData.geburtsdatum,
        geschlecht: patientData.geschlecht || undefined,
        telefon: patientData.telefon || undefined,
        staatsangehoerigkeit: patientData.staatsangehoerigkeit || undefined,
        strasse: patientData.strasse || undefined,
        plz: patientData.plz || undefined,
        ort: patientData.ort || undefined,
        beschaeftigt_als: patientData.beschaeftigt_als || undefined,
        beschaeftigt_seit: patientData.beschaeftigt_seit || undefined,
        familienversichert: patientData.familienversichert,
        familienversichert_name: patientData.familienversichert_name || undefined,
        pflegekasse: patientData.pflegekasse || undefined,
      });
      return patientId;
    } else {
      // Neuen Patienten erstellen
      const newPatient = await patientenApi.create({
        vorname: patientData.vorname,
        nachname: patientData.nachname,
        geburtsdatum: patientData.geburtsdatum,
        geschlecht: patientData.geschlecht || undefined,
        telefon: patientData.telefon || undefined,
        staatsangehoerigkeit: patientData.staatsangehoerigkeit || undefined,
        strasse: patientData.strasse || undefined,
        plz: patientData.plz || undefined,
        ort: patientData.ort || undefined,
        beschaeftigt_als: patientData.beschaeftigt_als || undefined,
        beschaeftigt_seit: patientData.beschaeftigt_seit || undefined,
        familienversichert: patientData.familienversichert,
        familienversichert_name: patientData.familienversichert_name || undefined,
        pflegekasse: patientData.pflegekasse || undefined,
      });
      setPatientId(newPatient.id);
      return newPatient.id;
    }
  };

  const saveKrankenkasse = async (): Promise<number | undefined> => {
    const data = getValues("krankenkasse");
    if (!data.name || !data.ik_nummer) return undefined;

    if (krankenkasseId) {
      return krankenkasseId;
    }

    try {
      const newKK = await krankenkassenApi.create({
        name: data.name,
        kuerzel: data.kuerzel,
        ik_nummer: data.ik_nummer,
      });
      setKrankenkasseId(newKK.id);
      return newKK.id;
    } catch (e) {
      // IK-Nummer existiert schon - suchen und ID zurückgeben
      console.log(e);

      const existing = await krankenkassenApi.search(data.ik_nummer);
      if (existing.length > 0) {
        setKrankenkasseId(existing[0].id);
        return existing[0].id;
      }
      return undefined;
    }
  };

  const saveUnfallbetrieb = async (): Promise<number | undefined> => {
    const data = getValues("unfallbetrieb");
    if (!data.name) return undefined;

    if (unfallbetriebId) {
      return unfallbetriebId;
    }

    const newUB = await unfallbetriebeApi.create({
      name: data.name,
      strasse: data.strasse || undefined,
      plz: data.plz || undefined,
      ort: data.ort || undefined,
      telefon: data.telefon || undefined,
      branche: data.branche || undefined,
    });
    setUnfallbetriebId(newUB.id);
    return newUB.id;
  };

  const saveUvTraeger = async (): Promise<number | undefined> => {
    const data = getValues("uv_traeger");
    if (!data.name) return undefined;

    if (uvTraegerId) {
      return uvTraegerId;
    }

    const newUV = await uvTraegerApi.create({
      name: data.name,
      kuerzel: data.kuerzel,
      adresse: data.adresse || undefined,
      telefon: data.telefon || undefined,
      email: data.email || undefined,
    });
    setUvTraegerId(newUV.id);
    return newUV.id;
  };

  // ===== ALS ENTWURF SPEICHERN =====
  const saveAsDraft = async () => {
    setIsSaving(true);

    try {
      // 1. Patient speichern
      const savedPatientId = await savePatient();

      // 2. Andere Entities speichern 
      const savedKKId = await saveKrankenkasse();
      const savedUBId = await saveUnfallbetrieb();
      const savedUVId = await saveUvTraeger();

      // 3. Bericht-Daten vorbereiten
      const berichtData = getValues("bericht");

      const berichtPayload: BerichtCreate = {
        lfd_nr: berichtData.lfd_nr || `DRAFT-${Date.now()}`,
        patient_id: savedPatientId,
        unfalltag: berichtData.unfalltag || new Date().toISOString().split("T")[0],
        status: "entwurf",
        uv_traeger_id: savedUVId,
        unfallbetrieb_id: savedUBId,
        ist_pflegeunfall: berichtData.ist_pflegeunfall,
        unfallzeit: berichtData.unfallzeit || undefined,
        unfallort: berichtData.unfallort || undefined,
        arbeitszeit_beginn: berichtData.arbeitszeit_beginn || undefined,
        arbeitszeit_ende: berichtData.arbeitszeit_ende || undefined,
        unfallhergang: berichtData.unfallhergang || undefined,
        verhalten_nach_unfall: berichtData.verhalten_nach_unfall || undefined,
        art_erstversorgung: berichtData.art_erstversorgung || undefined,
        erstbehandlung_datum: berichtData.erstbehandlung_datum || undefined,
        erstbehandlung_durch: berichtData.erstbehandlung_durch || undefined,
        verdacht_alkohol_drogen: berichtData.verdacht_alkohol_drogen,
        alkohol_drogen_anzeichen: berichtData.alkohol_drogen_anzeichen || undefined,
        blutentnahme_durchgefuehrt: berichtData.blutentnahme_durchgefuehrt,
        beschwerden_klagen: berichtData.beschwerden_klagen || undefined,
        handverletzung: berichtData.handverletzung,
        gebrauchshand: berichtData.gebrauchshand || undefined,
        klinische_befunde: berichtData.klinische_befunde || undefined,
        polytrauma: berichtData.polytrauma,
        iss_score: berichtData.iss_score ? parseInt(berichtData.iss_score) : undefined,
        bildgebende_diagnostik: berichtData.bildgebende_diagnostik || undefined,
        erstdiagnose_freitext: berichtData.erstdiagnose_freitext || undefined,
        erstdiagnose_icd10: berichtData.erstdiagnose_icd10 || undefined,
        erstdiagnose_ao: berichtData.erstdiagnose_ao || undefined,
        art_da_versorgung: berichtData.art_da_versorgung || undefined,
        vorerkrankungen: berichtData.vorerkrankungen || undefined,
        zweifel_arbeitsunfall: berichtData.zweifel_arbeitsunfall,
        zweifel_begruendung: berichtData.zweifel_begruendung || undefined,
        heilbehandlung_art: berichtData.heilbehandlung_art || undefined,
        keine_heilbehandlung_grund: berichtData.keine_heilbehandlung_grund || undefined,
        verletzung_vav: berichtData.verletzung_vav,
        verletzung_vav_ziffer: berichtData.verletzung_vav_ziffer || undefined,
        verletzung_sav: berichtData.verletzung_sav,
        verletzung_sav_ziffer: berichtData.verletzung_sav_ziffer || undefined,
        weiterbehandlung_durch: berichtData.weiterbehandlung_durch || undefined,
        anderer_arzt_name: berichtData.anderer_arzt_name || undefined,
        anderer_arzt_adresse: berichtData.anderer_arzt_adresse || undefined,
        arbeitsfaehig: berichtData.arbeitsfaehig ?? undefined,
        arbeitsunfaehig_ab: berichtData.arbeitsunfaehig_ab || undefined,
        arbeitsfaehig_ab: berichtData.arbeitsfaehig_ab || undefined,
        au_laenger_3_monate: berichtData.au_laenger_3_monate,
        weitere_aerzte_noetig: berichtData.weitere_aerzte_noetig,
        weitere_aerzte_namen: berichtData.weitere_aerzte_namen || undefined,
        wiedervorstellung_datum: berichtData.wiedervorstellung_datum || undefined,
        wiedervorstellung_mitgeteilt: berichtData.wiedervorstellung_mitgeteilt,
        bemerkungen: berichtData.bemerkungen || undefined,
        weitere_ausfuehrungen: berichtData.weitere_ausfuehrungen || undefined,
        datenschutz_hinweis_gegeben: berichtData.datenschutz_hinweis_gegeben,
        mitteilung_behandelnder_arzt: berichtData.mitteilung_behandelnder_arzt || undefined,
        datum_mitteilung_behandelnder_arzt: berichtData.datum_mitteilung_behandelnder_arzt || undefined,
        ergaenzung_kopfverletzung: berichtData.ergaenzung_kopfverletzung,
        ergaenzung_knieverletzung: berichtData.ergaenzung_knieverletzung,
        ergaenzung_schulterverletzung: berichtData.ergaenzung_schulterverletzung,
        ergaenzung_verbrennung: berichtData.ergaenzung_verbrennung,
      };

      // 4. Bericht erstellen oder aktualisieren
      if (currentBerichtId) {
        // Update
        await berichteApi.update(currentBerichtId, berichtPayload as BerichtUpdate);
        // toastManager.add({
        //   title: "Gespeichert",
        //   description: "Entwurf wurde aktualisiert.",
        //   type: "success"
        // });
      } else {
        // Create
        const newBericht = await berichteApi.create(berichtPayload);
        setCurrentBerichtId(newBericht.id);
        setValue("bericht.id", newBericht.id);
        toastManager.add({
          title: "Gespeichert",
          description: "Entwurf wurde erstellt.",
          type: "success"
        });

        // URL aktualisieren
        router.replace(`/formular?id=${newBericht.id}`, { scroll: false });
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      toastManager.add({
        title: "Fehler",
        description: (error instanceof Error ? error.message : "Speichern fehlgeschlagen."),
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ===== NAVIGATION =====
  const handleNext = async () => {
    const currentStepSchema = stepSchemas[step as keyof typeof stepSchemas];
    const formData = getValues();

    const result = (currentStepSchema as ZodTypeAny).safeParse(formData);

    if (result.success) {
      // Auto-Save als Entwurf beim Weitergehen
      if (step === 1) {
        try {
          await saveAsDraft();
        } catch (e) {
          console.log("Auto-save fehlgeschlagen, aber weiter...", e);
        }
      }

      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toastManager.add({
        title: "Validierungsfehler",
        description: "Bitte füllen Sie alle rot markierten Felder aus.",
        type: "error",
      });

      result.error.issues.forEach((issue: ZodIssue, index: number) => {
        // Try to use strongly-typed error path; fallback to 'root'
        const typedPath = issue.path.join(".") as keyof ReportFormValues | `root.${string}` | "root";
        setError(typedPath, { message: issue.message, type: "manual" }, { shouldFocus: index === 0 });
      });
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== FINAL SUBMIT =====
  const onSubmit = async (data: ReportFormValues) => {
    setIsLoading(true);

    try {
      // Validierung Step 5
      const step5Result = step5Schema.safeParse(data);
      if (!step5Result.success) {
        toastManager.add({
          title: "Validierungsfehler",
          description: "Bitte füllen Sie die Pflichtfelder im Abschluss-Bereich aus.",
          type: "error",
        });
        step5Result.error.issues.forEach((issue, index) => {
          // Try to use a strongly-typed path; fallback to 'root'
          const typedPath = issue.path.join(".") as keyof ReportFormValues | `root.${string}` | "root";
          setError(typedPath, { message: issue.message, type: "manual" }, { shouldFocus: index === 0 });
        });
        return;
      }

      // Speichern
      await saveAsDraft();

      // Abschließen
      if (currentBerichtId) {
        // setLoadingPDF(true)
        await berichteApi.abschliessen(currentBerichtId);

        // PDF automatisch herunterladen
        try {


          // PDF für UV-Träger herunterladen
          await pdfApi.downloadAndSave(currentBerichtId, 'uv');



          // setLoadingPDF(false)
          toastManager.add({
            title: "Erfolgreich",
            description: "Bericht wurde abgeschlossen und PDF heruntergeladen!",
            type: "success"
          });
        }
        catch (pdfError) {
          // setLoadingPDF(false)
          console.error("PDF-Generierung fehlgeschlagen:", pdfError);
          toastManager.add({
            title: "Erfolgreich",
            description: "Bericht abgeschlossen. PDF-Download fehlgeschlagen.",
            type: "warning"
          });
        }

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Fehler:", error);
      if (error instanceof Error) {
        toastManager.add({
          title: "Fehler",
          description: error.message,
          type: "error",
        });
      } else {
        toastManager.add({
          title: "Fehler",
          description: "Ein Fehler ist aufgetreten.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = () => {
    toastManager.add({
      title: "Validierungsfehler",
      description: "Formular enthält Fehler. Bitte prüfen.",
      type: "error",
    });
  };

  // ===== LOADING STATE =====
  if (isLoadingBericht) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          <p className="text-muted-foreground">Bericht wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-background pb-24">
      {/* HEADER */}
      <div className="bg-white dark:bg-black border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {currentBerichtId ? "Bericht bearbeiten" : "Neuer Bericht"}
              <span className="font-medium text-sm border-l text-muted-foreground pl-2 ml-2">
                F 1000
              </span>
            </h1>
          </div>

          {/* Stepper */}
          <div className="">
            <div className="w-full">
              <Stepper
                value={step}
                onValueChange={(next) => {
                  if (typeof next === "number" && step > next) setStep(next);
                }}
                className="w-full"
              >
                {steps.map((s, index) => (
                  <StepperItem
                    key={s.id}
                    step={s.id}
                    className="not-last:flex-1 max-md:items-start"
                  >
                    <StepperTrigger className="rounded max-md:flex-col">
                      <StepperIndicator>
                        <span className="text-xs font-bold">
                          {step > s.id ? <Check className="size-4" /> : s.id}
                        </span>
                      </StepperIndicator>

                      <div className="text-center md:text-left">
                        <StepperTitle
                          className={`text-[10px] font-medium uppercase tracking-wide hidden sm:block ${step >= s.id ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
                          {s.label}
                        </StepperTitle>
                      </div>
                    </StepperTrigger>
                    {index < steps.length - 1 && (
                      <StepperSeparator className="max-md:mt-2.5 md:mx-2" />
                    )}
                  </StepperItem>
                ))}
              </Stepper>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULAR CONTENT */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-5xl">
            <div className="bg-background rounded-none sm:rounded-lg p-6 sm:p-10 min-h-[500px] border shadow-sm">
              {step === 1 && (
                <Step1Form
                  onPatientSelect={(id) => setPatientId(id)}
                  selectedPatientId={patientId}
                />
              )}
              {step === 2 && (
                <Step2Form
                  onKrankenkasseSelect={(id) => setKrankenkasseId(id)}
                  onUnfallbetriebSelect={(id) => setUnfallbetriebId(id)}
                  onUvTraegerSelect={(id) => setUvTraegerId(id)}
                  selectedKrankenkasseId={krankenkasseId}
                  selectedUnfallbetriebId={unfallbetriebId}
                  selectedUvTraegerId={uvTraegerId}
                />
              )}
              {step === 3 && <Step3Form />}
              {step === 4 && <Step4Form />}
              {step === 5 && (
                <Step5Form
                  systemMeta={{ erstellt_am: new Date().toLocaleDateString("de-DE") }}
                />
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0  border-t  z-40 shadow bg-background">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* SAVE DRAFT */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={saveAsDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <Spinner />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:flex">
                Als Entwurf speichern
              </span>
              <span className="sm:hidden flex">
                Entwerfen
              </span>
            </Button>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center gap-3 ml-auto">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            ) : (
              <Button type="button" variant="destructive" asChild>
                <Link href="/dashboard">
                  Abbrechen
                </Link>
              </Button>
            )}

            {step < 5 ? (
              <Button type="button" onClick={handleNext}>
                Weiter
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit, onInvalid)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Bericht abschließen
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
