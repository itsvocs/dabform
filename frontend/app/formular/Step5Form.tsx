// app/formular-seiten/Step5Form.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
import { Section, Label, Input, Textarea, Checkbox, DebugPanel } from "./FormUI";

type SystemMeta = {
  erstellt_am?: string;
  abgeschlossen_am?: string;
};

export function Step5Form({
  systemMeta,
  onFinish,
  onBack,
}: {
  systemMeta: SystemMeta;
  onFinish: () => void;
  onBack: () => void;
}) {
  const {
    register,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<ReportFormValues>();

  // ================= WATCH =================
  const datenschutz = useWatch({
    control,
    name: "bericht.datenschutz_hinweis_gegeben",
  });

  // Watcher für die Zusammenfassung (Read-Only)
  const nachname = useWatch({ control, name: "patient.nachname" });
  const vorname = useWatch({ control, name: "patient.vorname" });
  const geburtsdatum = useWatch({ control, name: "patient.geburtsdatum" });
  const unfalltag = useWatch({ control, name: "bericht.unfalltag" });
  const lfdNr = useWatch({ control, name: "bericht.lfd_nr" });

  // Watcher für Ergänzungsberichte (Read-Only Status)
  const ergKopf = useWatch({ control, name: "bericht.ergaenzung_kopfverletzung" });
  const ergKnie = useWatch({ control, name: "bericht.ergaenzung_knieverletzung" });
  const ergSchulter = useWatch({ control, name: "bericht.ergaenzung_schulterverletzung" });
  const ergVerbrennung = useWatch({ control, name: "bericht.ergaenzung_verbrennung" });

  return (
    <form className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
        {/* ================================================= */}
        {/* ABSCHLUSS & SIGNATUR */}
        {/* ================================================= */}
        <Section title="Abschluss & Signatur" subtitle="Angaben zum unterzeichnenden Arzt">
           <div className="grid grid-cols-1 gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <Label required>Datum</Label>
                    <Input 
                      type="date"
                      {...register("bericht.datum_mitteilung_behandelnder_arzt")}
                      error={errors.bericht?.datum_mitteilung_behandelnder_arzt?.message}
                    />
                 </div>
              </div>

              <div>
                  <Label required>Name & Anschrift des Durchgangsarztes (Stempel)</Label>
                  <Textarea 
                    className="min-h-[120px] font-medium"
                    placeholder="Dr. Med. Musterarzt&#10;Musterstraße 1&#10;12345 Musterstadt"
                    {...register("bericht.mitteilung_behandelnder_arzt")}
                    error={errors.bericht?.mitteilung_behandelnder_arzt?.message}
                  />
              </div>

              <div>
                 <Label>Weitere Ausführungen / Bemerkungen</Label>
                 <Textarea 
                   placeholder="Optionale Anmerkungen..."
                   {...register("bericht.weitere_ausfuehrungen")} 
                 />
              </div>
           </div>
        </Section>

        {/* ================================================= */}
        {/* ZUSAMMENFASSUNG (READ ONLY) */}
        {/* ================================================= */}
        <Section title="Zusammenfassung" subtitle="Überblick der erfassten Grunddaten">
           <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 border-b border-slate-200 pb-2 mb-2">
                 <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patientendaten</h5>
              </div>

              <div>
                 <Label>Name</Label>
                 <Input value={`${vorname || ''} ${nachname || ''}`} disabled />
              </div>
              <div>
                 <Label>Geburtsdatum</Label>
                 <Input value={geburtsdatum || ''} disabled />
              </div>

              <div className="md:col-span-2 border-b border-slate-200 pb-2 mb-2 mt-2">
                 <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unfalldaten</h5>
              </div>

              <div>
                 <Label>Unfalltag</Label>
                 <Input value={unfalltag || ''} disabled />
              </div>
              <div>
                 <Label>Laufende Nummer</Label>
                 <Input value={lfdNr || ''} disabled />
              </div>

              {/* Status Ergänzungsberichte */}
              <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                 <Label>Erforderliche Ergänzungsberichte (automatisch erkannt)</Label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-2 opacity-60">
                       <Checkbox checked={ergKopf === true} disabled />
                       <span className="text-sm">F 1002 Kopfverletzung</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                       <Checkbox checked={ergKnie === true} disabled />
                       <span className="text-sm">F 1004 Knieverletzung</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                       <Checkbox checked={ergSchulter === true} disabled />
                       <span className="text-sm">F 1006 Schulterverletzung</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                       <Checkbox checked={ergVerbrennung === true} disabled />
                       <span className="text-sm">F 1008 Schwere Verbrennung</span>
                    </div>
                 </div>
              </div>

           </div>
        </Section>

        {/* ================================================= */}
        {/* DATENSCHUTZ */}
        {/* ================================================= */}
        <Section title="Datenschutz & Rechtsbelehrung" subtitle="Bestätigung erforderlich">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                 <div className="pt-0.5">
                    <Checkbox
                      checked={datenschutz === true}
                      onChange={(e) => setValue("bericht.datenschutz_hinweis_gegeben", e.target.checked, { shouldValidate: true })}
                      id="datenschutz"
                    />
                 </div>
                 <div>
                    <label htmlFor="datenschutz" className="text-sm font-medium text-slate-900 cursor-pointer block">
                       Bestätigung nach § 201 SGB VII *
                    </label>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                       Ich bestätige hiermit, dass der versicherten Person der Hinweis gemäß § 201 SGB VII gegeben wurde, dass die Daten an die gesetzliche Unfallversicherung übermittelt werden.
                    </p>
                    {errors.bericht?.datenschutz_hinweis_gegeben && (
                      <p className="mt-2 text-[11px] font-bold text-red-600">
                        {errors.bericht.datenschutz_hinweis_gegeben.message}
                      </p>
                    )}
                 </div>
              </div>
           </div>
        </Section>

        {/* ================================================= */}
        {/* SYSTEMDATEN */}
        {/* ================================================= */}
        <div className="text-center py-4 border-t border-slate-100 text-xs text-slate-400">
           <p>System-ID: {lfdNr || "Neu"} • Erstellt: {systemMeta.erstellt_am ? new Date(systemMeta.erstellt_am).toLocaleDateString() : "-"} • Formular: F 1000</p>
        </div>

      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}
      <div className="flex justify-between pt-8 border-t border-slate-100 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          &larr; Zurück
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onFinish}
          className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Wird gespeichert..." : "Bericht kostenpflichtig abschließen ✓"}
        </button>
      </div>

      {process.env.NODE_ENV === "development" && <DebugPanel control={control} />}
    </form>
  );
}