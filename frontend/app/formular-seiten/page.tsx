// app/formular-seiten/page.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";

// Schemas
import { 
  ReportFormValues, 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema, 
  step5Schema 
} from "./schemas";

// Formular Schritte
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { Step3Form } from "./Step3Form";
import { Step4Form } from "./Step4Form";
import { Step5Form } from "./Step5Form";

// Mapping der Schemas
const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
};

export default function NewReportPage() {
  const [step, setStep] = useState(1);

  const form = useForm<ReportFormValues>({
    mode: "onChange",
    defaultValues: {
      patient: {
        familienversichert: false,
        vorname: "",
        nachname: "",
        strasse: "",
        plz: "",
        ort: "",
        telefon: "",
        geschlecht: "", 
        staatsangehoerigkeit: "",
        beschaeftigt_als: "",
      },
      bericht: {
        ist_pflegeunfall: false,
        verdacht_alkohol_drogen: false,
        blutentnahme_durchgefuehrt: false,
        handverletzung: false,
        polytrauma: false,
        zweifel_arbeitsunfall: false,
        arbeitsfaehig: null,
        au_laenger_3_monate: false,
        weitere_aerzte_noetig: false,
        wiedervorstellung_mitgeteilt: false,
        datenschutz_hinweis_gegeben: false,
        unfallhergang: "",
        unfallort: "",
      },
      krankenkasse: { name: "", kuerzel: "", ik_nummer: "" },
      unfallbetrieb: { name: "", strasse: "", plz: "", ort: "", telefon: "", branche: "" },
      uv_traeger: { name: "", kuerzel: "", adresse: "", telefon: "", email: "" },
    },
  });

  const { trigger, handleSubmit, setError, getValues } = form;

  const handleNext = async () => {
    const currentStepSchema = stepSchemas[step as keyof typeof stepSchemas];
    const formData = getValues();
    const result = currentStepSchema.safeParse(formData);

    if (result.success) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Nach oben scrollen
    } else {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".") as any;
        setError(fieldName, { 
          message: issue.message, 
          type: "manual" 
        });
      });
      // Trigger validation to update UI focus states (optional but recommended)
      trigger(Object.keys(result.error.flatten().fieldErrors) as any);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (data: ReportFormValues) => {
    console.log("FINAL SUBMIT", data);
    alert("Bericht erfolgreich gespeichert! (Siehe Konsole)");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header / Fortschrittsanzeige */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <h1 className="font-semibold text-lg">Unfallbericht erfassen</h1>
          <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-200 border border-slate-700">
            Schritt {step} von 5
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <FormProvider {...form}>
            {/* onSubmit hier verhindern, wird in Step5Form gehandhabt oder via Buttons */}
            <form onSubmit={(e) => e.preventDefault()}>
              
              {step === 1 && <Step1Form onNext={handleNext} />}
              
              {step === 2 && (
                <Step2Form onNext={handleNext} onBack={handleBack} />
              )}
              
              {step === 3 && (
                <Step3Form onNext={handleNext} onBack={handleBack} />
              )}
              
              {step === 4 && (
                <Step4Form onNext={handleNext} onBack={handleBack} />
              )}
              
              {step === 5 && (
                <Step5Form
                  onBack={handleBack}
                  systemMeta={{ erstellt_am: new Date().toLocaleDateString("de-DE") }}
                  onFinish={handleSubmit(onSubmit)}
                />
              )}

            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}