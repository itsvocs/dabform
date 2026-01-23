// app/formular/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { berichteApi, patientenApi } from '@/lib/api';
import type { BerichtCreate, PatientCreate } from '@/types';

import { Step1Patient } from './steps/Step1Patient';
import { Step2Unfall } from './steps/Step2Unfall';
import { Step3Befund } from './steps/Step3Befund';
import { Step4Behandlung } from './steps/Step4Behandlung';
import { Step5Abschluss } from './steps/Step5Abschluss';
import { useDraftStorage } from '@/hooks/useDraftStorage';
import { FormularData } from '@/types/formular';

// Helper: Leere Strings zu undefined
const cleanString = (val: string | undefined | null): string | undefined =>
  val && val.trim() ? val.trim() : undefined;

// Helper: String zu number oder undefined
const cleanNumber = (val: string | undefined | null): number | undefined => {
  if (!val) return undefined;
  const num = parseInt(val, 10);
  return isNaN(num) ? undefined : num;
};

export default function FormularPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    currentDraft,
    isLoading: draftLoading,
    createNewDraft,
    saveDraft,
    setBerichtId,
    completeDraft,
  } = useDraftStorage();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Draft initialisieren
  useEffect(() => {
    if (!draftLoading && !currentDraft) {
      createNewDraft();
    } else if (currentDraft) {
      setStep(currentDraft.currentStep);
    }
  }, [draftLoading, currentDraft, createNewDraft]);

  // Loading state
  if (authLoading || draftLoading || !currentDraft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-slate-500">Laden...</div>
      </div>
    );
  }

  const formData = currentDraft.data;

  // Navigation
  const handleNext = async (stepData: Partial<FormularData>) => {
    setError(null);
    saveDraft(stepData, step + 1);
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    saveDraft({}, step - 1);
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepChange = (stepData: Partial<FormularData>) => {
    saveDraft(stepData);
  };

  // Finaler Submit
  const handleSubmit = async (finalData: Partial<FormularData>) => {
    setIsSaving(true);
    setError(null);

    try {
      const fullData = { ...formData, ...finalData };

      // 1. Patient erstellen
      let patientId = fullData.patient.id;

      if (!patientId) {
        const patientPayload: PatientCreate = {
          vorname: fullData.patient.vorname,
          nachname: fullData.patient.nachname,
          geburtsdatum: fullData.patient.geburtsdatum,
          geschlecht: cleanString(fullData.patient.geschlecht),
          telefon: cleanString(fullData.patient.telefon),
          staatsangehoerigkeit: cleanString(fullData.patient.staatsangehoerigkeit),
          strasse: cleanString(fullData.patient.strasse),
          plz: cleanString(fullData.patient.plz),
          ort: cleanString(fullData.patient.ort),
          familienversichert: fullData.patient.familienversichert || false,
          beschaeftigt_als: cleanString(fullData.patient.beschaeftigt_als),
        };

        console.log('Creating patient:', patientPayload);
        const patient = await patientenApi.create(patientPayload);
        patientId = patient.id;
        console.log('Patient created with ID:', patientId);
      }

      // 2. Bericht Daten vorbereiten
      const berichtData: BerichtCreate = {
        // Pflichtfelder
        lfd_nr: fullData.lfd_nr,
        patient_id: patientId,
        unfalltag: fullData.unfalltag,
        status: 'entwurf',

        // Unfalldaten
        unfallzeit: cleanString(fullData.unfallzeit),
        unfallort: cleanString(fullData.unfallort),
        arbeitszeit_beginn: cleanString(fullData.arbeitszeit_beginn),
        arbeitszeit_ende: cleanString(fullData.arbeitszeit_ende),
        unfallhergang: cleanString(fullData.unfallhergang),
        verhalten_nach_unfall: cleanString(fullData.verhalten_nach_unfall),

        // Erstversorgung
        art_erstversorgung: cleanString(fullData.art_erstversorgung),
        erstbehandlung_datum: cleanString(fullData.erstbehandlung_datum),
        erstbehandlung_durch: cleanString(fullData.erstbehandlung_durch),

        // Befund
        verdacht_alkohol_drogen: fullData.verdacht_alkohol_drogen || false,
        alkohol_drogen_anzeichen: cleanString(fullData.alkohol_drogen_anzeichen),
        blutentnahme_durchgefuehrt: fullData.blutentnahme_durchgefuehrt || false,
        beschwerden_klagen: cleanString(fullData.beschwerden_klagen),
        klinische_befunde: cleanString(fullData.klinische_befunde),
        bildgebende_diagnostik: cleanString(fullData.bildgebende_diagnostik),
        erstdiagnose_freitext: cleanString(fullData.erstdiagnose_freitext),

        // Spezielle Verletzungen
        handverletzung: fullData.handverletzung || false,
        gebrauchshand: cleanString(fullData.gebrauchshand),
        polytrauma: fullData.polytrauma || false,
        iss_score: cleanNumber(fullData.iss_score),

        // Diagnose
        erstdiagnose_icd10: cleanString(fullData.erstdiagnose_icd10),
        erstdiagnose_ao: cleanString(fullData.erstdiagnose_ao),

        // Beurteilung
        art_da_versorgung: cleanString(fullData.art_da_versorgung),
        vorerkrankungen: cleanString(fullData.vorerkrankungen),
        zweifel_arbeitsunfall: fullData.zweifel_arbeitsunfall || false,
        zweifel_begruendung: cleanString(fullData.zweifel_begruendung),

        // Heilbehandlung
        heilbehandlung_art: cleanString(fullData.heilbehandlung_art),
        keine_heilbehandlung_grund: cleanString(fullData.keine_heilbehandlung_grund),
        verletzung_vav: fullData.verletzung_vav || false,
        verletzung_vav_ziffer: cleanString(fullData.verletzung_vav_ziffer),
        verletzung_sav: fullData.verletzung_sav || false,
        verletzung_sav_ziffer: cleanString(fullData.verletzung_sav_ziffer),

        // Weiterbehandlung
        weiterbehandlung_durch: cleanString(fullData.weiterbehandlung_durch),
        anderer_arzt_name: cleanString(fullData.anderer_arzt_name),
        anderer_arzt_adresse: cleanString(fullData.anderer_arzt_adresse),

        // Arbeitsfähigkeit
        arbeitsfaehig: fullData.arbeitsfaehig ?? undefined,
        arbeitsunfaehig_ab: cleanString(fullData.arbeitsunfaehig_ab),
        arbeitsfaehig_ab: cleanString(fullData.arbeitsfaehig_ab),
        au_laenger_3_monate: fullData.au_laenger_3_monate || false,

        // Weitere Ärzte
        weitere_aerzte_noetig: fullData.weitere_aerzte_noetig || false,
        weitere_aerzte_namen: cleanString(fullData.weitere_aerzte_namen),

        // Wiedervorstellung
        wiedervorstellung_datum: cleanString(fullData.wiedervorstellung_datum),
        wiedervorstellung_mitgeteilt: fullData.wiedervorstellung_mitgeteilt || false,

        // Abschluss
        bemerkungen: cleanString(fullData.bemerkungen),
        weitere_ausfuehrungen: cleanString(fullData.weitere_ausfuehrungen),
        mitteilung_behandelnder_arzt: cleanString(fullData.mitteilung_behandelnder_arzt),
        datenschutz_hinweis_gegeben: fullData.datenschutz_hinweis_gegeben || false,

        // Ergänzungsberichte
        ergaenzung_kopfverletzung: fullData.ergaenzung_kopfverletzung || false,
        ergaenzung_knieverletzung: fullData.ergaenzung_knieverletzung || false,
        ergaenzung_schulterverletzung: fullData.ergaenzung_schulterverletzung || false,
        ergaenzung_verbrennung: fullData.ergaenzung_verbrennung || false,
      };

      console.log('Creating bericht:', berichtData);

      // 3. Bericht erstellen oder aktualisieren
      let bericht;
      if (currentDraft.berichtId) {
        bericht = await berichteApi.update(currentDraft.berichtId, berichtData);
      } else {
        bericht = await berichteApi.create(berichtData);
        setBerichtId(bericht.id);
      }

      console.log('Bericht created/updated:', bericht.id);

      // 4. Bericht abschließen
      await berichteApi.abschliessen(bericht.id);
      console.log('Bericht abgeschlossen');

      // 5. Draft löschen und weiterleiten
      completeDraft();
      router.push('/dashboard?success=bericht-erstellt');

    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  // Nur als Entwurf speichern
  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const fullData = formData;

      // Validierung
      if (!fullData.patient.vorname || !fullData.patient.nachname) {
        setError('Bitte mindestens Vorname und Nachname ausfüllen');
        setIsSaving(false);
        return;
      }
      if (!fullData.patient.geburtsdatum) {
        setError('Bitte Geburtsdatum ausfüllen');
        setIsSaving(false);
        return;
      }
      if (!fullData.lfd_nr) {
        setError('Bitte Lfd. Nr. ausfüllen');
        setIsSaving(false);
        return;
      }
      if (!fullData.unfalltag) {
        setError('Bitte Unfalltag ausfüllen');
        setIsSaving(false);
        return;
      }

      // Patient erstellen
      let patientId = fullData.patient.id;

      if (!patientId) {
        const patientPayload: PatientCreate = {
          vorname: fullData.patient.vorname,
          nachname: fullData.patient.nachname,
          geburtsdatum: fullData.patient.geburtsdatum,
          geschlecht: cleanString(fullData.patient.geschlecht),
          telefon: cleanString(fullData.patient.telefon),
          familienversichert: false,
        };

        const patient = await patientenApi.create(patientPayload);
        patientId = patient.id;

        // Patient ID im Draft speichern
        saveDraft({ patient: { ...fullData.patient, id: patientId } });
      }

      const berichtData: BerichtCreate = {
        lfd_nr: fullData.lfd_nr,
        patient_id: patientId,
        unfalltag: fullData.unfalltag,
        status: 'entwurf',
      };

      if (currentDraft.berichtId) {
        await berichteApi.update(currentDraft.berichtId, berichtData);
      } else {
        const bericht = await berichteApi.create(berichtData);
        setBerichtId(bericht.id);
      }

      alert('Entwurf gespeichert!');

    } catch (err) {
      console.error('Draft save error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h1 className="font-semibold text-lg">Unfallbericht erfassen</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Zuletzt gespeichert: {new Date(currentDraft.lastSaved).toLocaleString('de-DE')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAsDraft}
              disabled={isSaving}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Speichert...' : 'Entwurf speichern'}
            </button>
            <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-200 border border-slate-700">
              Schritt {step} von 5
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Fehler:</strong> {error}
          </div>
        )}

        {/* Steps */}
        <div className="p-6 sm:p-10">
          {step === 1 && (
            <Step1Patient
              data={formData}
              onChange={handleStepChange}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <Step2Unfall
              data={formData}
              onChange={handleStepChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <Step3Befund
              data={formData}
              onChange={handleStepChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 4 && (
            <Step4Behandlung
              data={formData}
              onChange={handleStepChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 5 && (
            <Step5Abschluss
              data={formData}
              onChange={handleStepChange}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}