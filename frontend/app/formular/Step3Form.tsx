// app/formular-seiten/Step3Form.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
// WICHTIG: Keine globals.css hier importieren, das passiert im layout.tsx
import { Section, Label, Input, Textarea, Checkbox, DebugPanel } from "./FormUI";

export function Step3Form({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // ===== WATCHER =====
  const verdachtAlkohol = useWatch({
    control,
    name: "bericht.verdacht_alkohol_drogen",
  });

  return (
    <form className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        
        {/* ===================================================== */}
        {/* UNFALLDATEN */}
        {/* ===================================================== */}
        <Section title="Unfallhergang" subtitle="Wann und wo ist der Unfall passiert?">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Zeitangaben im Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>Unfalltag</Label>
                <Input 
                  type="date" 
                  {...register("bericht.unfalltag")} 
                  error={errors.bericht?.unfalltag?.message}
                />
              </div>
              <div>
                <Label required>Unfallzeit</Label>
                <Input 
                  type="time" 
                  {...register("bericht.unfallzeit")} 
                  error={errors.bericht?.unfallzeit?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>Arbeitszeit Beginn</Label>
                <Input 
                  type="time" 
                  {...register("bericht.arbeitszeit_beginn")} 
                />
              </div>
              <div>
                <Label required>Arbeitszeit Ende</Label>
                <Input 
                  type="time" 
                  {...register("bericht.arbeitszeit_ende")} 
                />
              </div>
            </div>

            {/* Ort & Hergang */}
            <div>
              <Label required>Unfallort</Label>
              <Input 
                placeholder="Genaue Ortsangabe (Gebäude, Raum, Straße)"
                {...register("bericht.unfallort")} 
                error={errors.bericht?.unfallort?.message}
              />
            </div>

            <div>
              <Label required>Unfallhergang</Label>
              <Textarea 
                placeholder="Schilderung des Unfallhergangs..."
                className="min-h-[120px]"
                {...register("bericht.unfallhergang")} 
                error={errors.bericht?.unfallhergang?.message}
              />
            </div>
          </div>
        </Section>

        {/* ===================================================== */}
        {/* ERSTVERSORGUNG */}
        {/* ===================================================== */}
        <Section title="Erstversorgung" subtitle="Maßnahmen unmittelbar nach dem Unfall">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label required>Verhalten nach Unfall</Label>
              <Textarea 
                placeholder="z.B. Arbeit eingestellt, weitergearbeitet..."
                {...register("bericht.verhalten_nach_unfall")} 
                error={errors.bericht?.verhalten_nach_unfall?.message}
              />
            </div>

            <div>
              <Label required>Art der Erstversorgung</Label>
              <Textarea 
                placeholder="z.B. Wundverband angelegt..."
                {...register("bericht.art_erstversorgung")} 
                error={errors.bericht?.art_erstversorgung?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>Erstbehandlung am</Label>
                <Input 
                  type="date" 
                  {...register("bericht.erstbehandlung_datum")} 
                  error={errors.bericht?.erstbehandlung_datum?.message}
                />
              </div>
              <div>
                <Label required>Erstbehandlung durch</Label>
                <Input 
                  placeholder="Name des Arztes / Ersthelfers"
                  {...register("bericht.erstbehandlung_durch")} 
                  error={errors.bericht?.erstbehandlung_durch?.message}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ===================================================== */}
        {/* BEFUND & DIAGNOSE */}
        {/* ===================================================== */}
        <Section title="Befund & Diagnose" subtitle="Medizinische Feststellungen">
          <div className="grid grid-cols-1 gap-6">
            
            {/* ALKOHOL / DROGEN (Styled Box) */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-4">
                <Label>Besteht Verdacht auf Alkohol- oder Drogeneinfluss?</Label>
                
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={verdachtAlkohol === true}
                      onChange={() => setValue("bericht.verdacht_alkohol_drogen", true)}
                      id="alkohol-ja"
                    />
                    <label htmlFor="alkohol-ja" className="text-sm cursor-pointer">Ja</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={verdachtAlkohol === false}
                      onChange={() => {
                        setValue("bericht.verdacht_alkohol_drogen", false);
                        setValue("bericht.alkohol_drogen_anzeichen", "");
                      }}
                      id="alkohol-nein"
                    />
                    <label htmlFor="alkohol-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
                </div>

                {verdachtAlkohol && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <Label required>Welche Anzeichen?</Label>
                    <Input
                      placeholder="z.B. Alkoholgeruch, verwaschene Sprache"
                      {...register("bericht.alkohol_drogen_anzeichen")}
                      error={errors.bericht?.alkohol_drogen_anzeichen?.message}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Diagnosen */}
            <div>
              <Label required>Beschwerden / Klagen des Patienten</Label>
              <Textarea 
                {...register("bericht.beschwerden_klagen")} 
                error={errors.bericht?.beschwerden_klagen?.message}
              />
            </div>

            <div>
              <Label required>Klinische Befunde</Label>
              <Textarea 
                {...register("bericht.klinische_befunde")} 
                error={errors.bericht?.klinische_befunde?.message}
              />
            </div>

            <div>
              <Label required>Bildgebende Diagnostik</Label>
              <Textarea 
                placeholder="z.B. Röntgen linkes Handgelenk: Keine Fraktur"
                {...register("bericht.bildgebende_diagnostik")} 
                error={errors.bericht?.bildgebende_diagnostik?.message}
              />
            </div>

            <div>
              <Label required>Erstdiagnose (Freitext)</Label>
              <Textarea 
                className="min-h-[100px]"
                {...register("bericht.erstdiagnose_freitext")} 
                error={errors.bericht?.erstdiagnose_freitext?.message}
              />
            </div>

          </div>
        </Section>

      </div>

      {/* Navigation Buttons (Gleicher Style wie Step 2) */}
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
          onClick={onNext}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          Weiter zu Verfahren &rarr;
        </button>
      </div>

      {process.env.NODE_ENV === "development" && <DebugPanel control={control} />}
    </form>
  );
}