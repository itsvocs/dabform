// app/formular-seiten/Step4Form.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
import { Section, Label, Input, Textarea, Select, Checkbox, DebugPanel } from "./FormUI";

export function Step4Form({
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

  // ================= WATCHER =================
  const handverletzung = useWatch({ control, name: "bericht.handverletzung" });
  const polytrauma = useWatch({ control, name: "bericht.polytrauma" });
  const zweifel = useWatch({ control, name: "bericht.zweifel_arbeitsunfall" });
  const heilbehandlung = useWatch({ control, name: "bericht.heilbehandlung_art" });
  
  // VAV / SAV Logik
  const vav = useWatch({ control, name: "bericht.verletzung_vav" });
  const sav = useWatch({ control, name: "bericht.verletzung_sav" });

  const arbeitsfaehig = useWatch({ control, name: "bericht.arbeitsfaehig" });
  const weitereAerzte = useWatch({ control, name: "bericht.weitere_aerzte_noetig" });
  
  // Gebrauchshand Watcher für Radio-Logik
  const gebrauchshand = useWatch({ control, name: "bericht.gebrauchshand" });

  // Hilfsklasse für inaktive Bereiche
  const getDisabledClass = (isActive: boolean) => 
    `transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40 pointer-events-none select-none grayscale"}`;

  return (
    <form className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

        {/* ================================================= */}
        {/* VERLETZUNGEN */}
        {/* ================================================= */}
        <Section title="Spezielle Verletzungen" subtitle="Angaben zu Handverletzungen und Polytrauma">
          <div className="space-y-6">
            
            {/* Handverletzung Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-4">
                <Label>Liegt eine Handverletzung vor?</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={handverletzung === true}
                      onChange={() => setValue("bericht.handverletzung", true, { shouldValidate: true })}
                      id="hand-ja"
                    />
                    <label htmlFor="hand-ja" className="text-sm cursor-pointer">Ja</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={handverletzung === false}
                      onChange={() => {
                        setValue("bericht.handverletzung", false, { shouldValidate: true });
                        setValue("bericht.gebrauchshand", ""); // Reset value
                      }}
                      id="hand-nein"
                    />
                    <label htmlFor="hand-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
                </div>

                {/* Immer sichtbar, aber ausgegraut wenn inaktiv */}
                <div className={getDisabledClass(handverletzung === true)}>
                    <Label required={handverletzung === true}>Gebrauchshand</Label>
                    <div className="flex gap-6 mt-2">
                       <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="radio" 
                            className="accent-slate-900 w-4 h-4"
                            checked={gebrauchshand === "links"}
                            onChange={() => setValue("bericht.gebrauchshand", "links")}
                            disabled={!handverletzung}
                          />
                          Links
                       </label>
                       <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="radio" 
                            className="accent-slate-900 w-4 h-4"
                            checked={gebrauchshand === "rechts"}
                            onChange={() => setValue("bericht.gebrauchshand", "rechts")}
                            disabled={!handverletzung}
                          />
                          Rechts
                       </label>
                    </div>
                    {errors.bericht?.gebrauchshand && (
                      <p className="mt-1 text-[11px] font-medium text-red-600">{errors.bericht.gebrauchshand.message}</p>
                    )}
                </div>
              </div>
            </div>

            {/* Polytrauma Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-4">
                <Label>Liegt ein Polytrauma vor?</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={polytrauma === true}
                      onChange={() => setValue("bericht.polytrauma", true, { shouldValidate: true })}
                      id="poly-ja"
                    />
                    <label htmlFor="poly-ja" className="text-sm cursor-pointer">Ja</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={polytrauma === false}
                      onChange={() => {
                        setValue("bericht.polytrauma", false, { shouldValidate: true });
                        setValue("bericht.iss_score", ""); // Reset value
                      }}
                      id="poly-nein"
                    />
                    <label htmlFor="poly-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
                </div>

                <div className={getDisabledClass(polytrauma === true)}>
                    <Label required={polytrauma === true}>ISS-Score</Label>
                    <Input 
                      type="number"
                      placeholder="z.B. 16"
                      {...register("bericht.iss_score")} 
                      error={errors.bericht?.iss_score?.message}
                      disabled={!polytrauma}
                    />
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* ================================================= */}
        {/* DIAGNOSEN */}
        {/* ================================================= */}
        <Section title="Diagnoseschlüssel" subtitle="Klassifizierung der Verletzung">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label required>ICD-10 Code</Label>
              <Input 
                placeholder="S62.6"
                {...register("bericht.erstdiagnose_icd10")} 
                error={errors.bericht?.erstdiagnose_icd10?.message}
              />
            </div>
            <div>
              <Label required>AO-Klassifikation</Label>
              <Input 
                placeholder="2R3A"
                {...register("bericht.erstdiagnose_ao")} 
                error={errors.bericht?.erstdiagnose_ao?.message}
              />
            </div>
          </div>
        </Section>

        {/* ================================================= */}
        {/* BEURTEILUNG */}
        {/* ================================================= */}
        <Section title="Ärztliche Beurteilung" subtitle="Versorgung und Vorerkrankungen">
          <div className="space-y-6">
            <div>
              <Label required>Art der Versorgung</Label>
              <Textarea 
                placeholder="Operativ / Konservativ..."
                {...register("bericht.art_da_versorgung")} 
                error={errors.bericht?.art_da_versorgung?.message}
              />
            </div>
            <div>
              <Label required>Vorerkrankungen / Vorschäden</Label>
              <Textarea 
                placeholder="Keine bekannt..."
                {...register("bericht.vorerkrankungen")} 
                error={errors.bericht?.vorerkrankungen?.message}
              />
            </div>

            {/* Zweifel Box */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
               <Label>Bestehen Zweifel am Arbeitsunfall?</Label>
               <div className="flex gap-6 mt-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={zweifel === true}
                      onChange={() => setValue("bericht.zweifel_arbeitsunfall", true, { shouldValidate: true })}
                      id="zweifel-ja"
                    />
                    <label htmlFor="zweifel-ja" className="text-sm cursor-pointer font-medium text-orange-900">Ja, Zweifel</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={zweifel === false}
                      onChange={() => {
                        setValue("bericht.zweifel_arbeitsunfall", false, { shouldValidate: true });
                        setValue("bericht.zweifel_begruendung", "");
                      }}
                      id="zweifel-nein"
                    />
                    <label htmlFor="zweifel-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
               </div>
               
               <div className={getDisabledClass(zweifel === true)}>
                    <Label required={zweifel === true}>Begründung der Zweifel</Label>
                    <Textarea 
                      className="border-orange-200 focus:ring-orange-200"
                      {...register("bericht.zweifel_begruendung")} 
                      error={errors.bericht?.zweifel_begruendung?.message}
                      disabled={!zweifel}
                    />
               </div>
            </div>
          </div>
        </Section>

        {/* ================================================= */}
        {/* HEILBEHANDLUNG & VERFAHREN */}
        {/* ================================================= */}
        <Section title="Heilbehandlung" subtitle="Weiteres Vorgehen und Verfahrensart">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <Label required>Art der Heilbehandlung</Label>
                  <Select
                    {...register("bericht.heilbehandlung_art")}
                    error={errors.bericht?.heilbehandlung_art?.message}
                    options={[
                      { value: "", label: "Bitte wählen" },
                      { value: "ambulant", label: "Allgemeine Heilbehandlung (ambulant)" },
                      { value: "stationaer", label: "Besondere Heilbehandlung (stationär)" },
                      { value: "keine", label: "Keine weitere Behandlung" },
                    ]}
                  />
               </div>
               
               <div className={getDisabledClass(heilbehandlung === "keine")}>
                    <Label required={heilbehandlung === "keine"}>Begründung</Label>
                    <Input 
                      placeholder="Warum keine Behandlung?"
                      {...register("bericht.keine_heilbehandlung_grund")} 
                      error={errors.bericht?.keine_heilbehandlung_grund?.message}
                      disabled={heilbehandlung !== "keine"}
                    />
               </div>
            </div>

            {/* VAV / SAV Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
               <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox 
                      checked={vav}
                      onChange={(e) => setValue("bericht.verletzung_vav", e.target.checked)}
                    />
                    <span className="text-sm font-medium">Verletzungsartenverfahren (VAV)</span>
                  </div>
                  
                  <div className={getDisabledClass(!!vav)}>
                    <Input 
                      placeholder="VAV Ziffer" 
                      {...register("bericht.verletzung_vav_ziffer")}
                      error={errors.bericht?.verletzung_vav_ziffer?.message}
                      disabled={!vav}
                    />
                  </div>
               </div>

               <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox 
                      checked={sav}
                      onChange={(e) => setValue("bericht.verletzung_sav", e.target.checked)}
                    />
                    <span className="text-sm font-medium">Schwerstverletzungsartenverfahren (SAV)</span>
                  </div>
                  
                  <div className={getDisabledClass(!!sav)}>
                    <Input 
                      placeholder="SAV Ziffer" 
                      {...register("bericht.verletzung_sav_ziffer")}
                      error={errors.bericht?.verletzung_sav_ziffer?.message}
                      disabled={!sav}
                    />
                  </div>
               </div>
            </div>

          </div>
        </Section>

        {/* ================================================= */}
        {/* ARBEITSUNFÄHIGKEIT */}
        {/* ================================================= */}
        <Section title="Arbeitsunfähigkeit" subtitle="Einschätzung der Arbeitsfähigkeit">
           <div className="space-y-6">
              <Label>Ist der Patient arbeitsfähig?</Label>
              <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={arbeitsfaehig === true}
                      onChange={() => setValue("bericht.arbeitsfaehig", true, { shouldValidate: true })}
                      id="au-ja"
                    />
                    <label htmlFor="au-ja" className="text-sm cursor-pointer">Ja, arbeitsfähig</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={arbeitsfaehig === false}
                      onChange={() => setValue("bericht.arbeitsfaehig", false, { shouldValidate: true })}
                      id="au-nein"
                    />
                    <label htmlFor="au-nein" className="text-sm cursor-pointer font-bold text-red-600">Nein, arbeitsunfähig</label>
                  </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-50 p-4 rounded-lg border border-red-100 ${getDisabledClass(arbeitsfaehig === false)}`}>
                   <div>
                      <Label required={arbeitsfaehig === false}>Arbeitsunfähig ab</Label>
                      <Input 
                        type="date"
                        {...register("bericht.arbeitsunfaehig_ab")} 
                        error={errors.bericht?.arbeitsunfaehig_ab?.message}
                        disabled={arbeitsfaehig !== false}
                      />
                   </div>
                   <div>
                      <Label required={arbeitsfaehig === false}>Voraussichtlich arbeitsfähig ab</Label>
                      <Input 
                        type="date"
                        {...register("bericht.arbeitsfaehig_ab")} 
                        error={errors.bericht?.arbeitsfaehig_ab?.message}
                        disabled={arbeitsfaehig !== false}
                      />
                   </div>
              </div>
           </div>
        </Section>

        {/* ================================================= */}
        {/* WEITERE ÄRZTE */}
        {/* ================================================= */}
        <Section title="Hinzuziehung" subtitle="Weitere Ärzte oder Fachgebiete">
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <Label>Sind weitere Ärzte hinzuzuziehen?</Label>
               <div className="flex gap-6 mt-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={weitereAerzte === true}
                      onChange={() => setValue("bericht.weitere_aerzte_noetig", true, { shouldValidate: true })}
                      id="arzt-ja"
                    />
                    <label htmlFor="arzt-ja" className="text-sm cursor-pointer">Ja</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={weitereAerzte === false}
                      onChange={() => setValue("bericht.weitere_aerzte_noetig", false, { shouldValidate: true })}
                      id="arzt-nein"
                    />
                    <label htmlFor="arzt-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
               </div>
               
               <div className={getDisabledClass(weitereAerzte === true)}>
                    <Label required={weitereAerzte === true}>Name oder Fachgebiet</Label>
                    <Textarea 
                      placeholder="z.B. Neurologisches Konsil erforderlich..."
                      {...register("bericht.weitere_aerzte_namen")} 
                      error={errors.bericht?.weitere_aerzte_namen?.message}
                      disabled={!weitereAerzte}
                    />
               </div>
           </div>
        </Section>

      </div>

      {/* Navigation */}
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
          Weiter zu Abschluss &rarr;
        </button>
      </div>

      {process.env.NODE_ENV === "development" && <DebugPanel control={control} />}
    </form>
  );
}