// app/formular-seiten/Step2Form.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
import { Section, Label, Input, Select, Checkbox, Textarea, DebugPanel } from "./FormUI";

export function Step2Form({
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
  // Wir beobachten die Werte, um Felder ein- oder auszublenden
  const istPflegeunfall = useWatch({
    control,
    name: "bericht.ist_pflegeunfall",
  });

  const istFamilienversichert = useWatch({
    control,
    name: "patient.familienversichert",
  });

  return (
    <form className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        
        {/* ============================================= */}
        {/* VERSICHERUNG */}
        {/* ============================================= */}
        <Section
          title="Versicherung"
          subtitle="Krankenversicherung des Patienten"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Krankenkasse Name */}
            <div className="md:col-span-2">
              <Label required>Krankenkasse</Label>
              <Input
                placeholder="AOK Hessen"
                {...register("krankenkasse.name")}
                error={errors.krankenkasse?.name?.message}
                autoComplete="organization"
              />
            </div>

            {/* Kürzel & IK */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label required>Kürzel</Label>
                <Input
                  placeholder="AOK"
                  {...register("krankenkasse.kuerzel")}
                  error={errors.krankenkasse?.kuerzel?.message}
                />
              </div>
              <div className="md:col-span-2">
                <Label required>IK-Nummer</Label>
                <Input
                  placeholder="10XXXXXXX"
                  {...register("krankenkasse.ik_nummer")}
                  error={errors.krankenkasse?.ik_nummer?.message}
                />
              </div>
            </div>

            {/* Familienversichert Logic */}
            <div className="md:col-span-3 border-t border-slate-100 pt-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Versicherungsstatus</Label>
                  <Select
                    value={istFamilienversichert ? "ja" : "nein"}
                    onChange={(e) => {
                      const v = e.target.value === "ja";
                      setValue("patient.familienversichert", v);
                      if (!v) setValue("patient.familienversichert_name", "");
                    }}
                    options={[
                      { value: "nein", label: "Privat / Mitglied" },
                      { value: "ja", label: "Familienversichert" },
                    ]}
                  />
                </div>

                <div className={`transition-opacity duration-300 ${istFamilienversichert ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <Label required={istFamilienversichert}>Name Hauptversicherte/r</Label>
                  <Input
                    placeholder="Max Mustermann"
                    {...register("patient.familienversichert_name")}
                    disabled={!istFamilienversichert}
                    error={errors.patient?.familienversichert_name?.message}
                  />
                </div>
              </div>
            </div>

            {/* Pflegeunfall Logic */}
            <div className="md:col-span-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-4">
                <Label>Handelt es sich um einen Pflegeunfall?</Label>
                
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={istPflegeunfall === true}
                      onChange={() => setValue("bericht.ist_pflegeunfall", true)}
                      id="pflege-ja"
                    />
                    <label htmlFor="pflege-ja" className="text-sm cursor-pointer">Ja</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={istPflegeunfall === false}
                      onChange={() => {
                        setValue("bericht.ist_pflegeunfall", false);
                        setValue("patient.pflegekasse", "");
                      }}
                      id="pflege-nein"
                    />
                     <label htmlFor="pflege-nein" className="text-sm cursor-pointer">Nein</label>
                  </div>
                </div>

                {istPflegeunfall && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <Label required>Pflegekasse</Label>
                    <Input
                      placeholder="z.B. AOK Pflegekasse"
                      {...register("patient.pflegekasse")}
                      error={errors.patient?.pflegekasse?.message}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>
        </Section>

        {/* ============================================= */}
        {/* UNFALLBETRIEB */}
        {/* ============================================= */}
        <Section title="Unfallbetrieb" subtitle="Angaben zum Arbeitgeber">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label required>Name des Unternehmens</Label>
              <Input
                placeholder="Musterfirma GmbH"
                {...register("unfallbetrieb.name")}
                error={errors.unfallbetrieb?.name?.message}
                autoComplete="organization"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>Straße</Label>
                <Input
                  {...register("unfallbetrieb.strasse")}
                  error={errors.unfallbetrieb?.strasse?.message}
                  placeholder="Industriestr. 5"
                />
              </div>
              <div>
                <Label required>Telefon</Label>
                <Input
                  {...register("unfallbetrieb.telefon")}
                  error={errors.unfallbetrieb?.telefon?.message}
                  placeholder="069 1234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label required>PLZ</Label>
                <Input
                  {...register("unfallbetrieb.plz")}
                  error={errors.unfallbetrieb?.plz?.message}
                  placeholder="12345"
                />
              </div>
              <div className="md:col-span-2">
                <Label required>Ort</Label>
                <Input
                  {...register("unfallbetrieb.ort")}
                  error={errors.unfallbetrieb?.ort?.message}
                  placeholder="Musterstadt"
                />
              </div>
            </div>

            <div>
              <Label required>Branche</Label>
              <Input
                placeholder="z.B. Bauhauptgewerbe"
                {...register("unfallbetrieb.branche")}
                error={errors.unfallbetrieb?.branche?.message}
              />
            </div>
          </div>
        </Section>

        {/* ============================================= */}
        {/* UV-TRÄGER */}
        {/* ============================================= */}
        <Section title="UV-Träger" subtitle="Daten der BG / Unfallkasse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label required>Name</Label>
              <Input
                {...register("uv_traeger.name")}
                error={errors.uv_traeger?.name?.message}
                placeholder="Berufsgenossenschaft der Bauwirtschaft"
              />
            </div>
            
            <div>
              <Label required>Kürzel</Label>
              <Input
                {...register("uv_traeger.kuerzel")}
                error={errors.uv_traeger?.kuerzel?.message}
                placeholder="BG BAU"
              />
            </div>

             <div>
              <Label required>Telefon</Label>
              <Input
                {...register("uv_traeger.telefon")}
                error={errors.uv_traeger?.telefon?.message}
                placeholder="0800 ..."
              />
            </div>

            <div className="md:col-span-2">
              <Label required>Anschrift</Label>
              <Textarea
                className="min-h-[80px]"
                {...register("uv_traeger.adresse")}
                error={errors.uv_traeger?.adresse?.message}
                placeholder="Straße, PLZ, Ort"
              />
            </div>

            <div className="md:col-span-2">
              <Label required>E-Mail</Label>
              <Input
                type="email"
                {...register("uv_traeger.email")}
                error={errors.uv_traeger?.email?.message}
                placeholder="info@bgbau.de"
              />
            </div>
          </div>
        </Section>

      </div>

      {/* Navigation Buttons */}
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
          Weiter zu Unfallhergang &rarr;
        </button>
      </div>
      
      {/* Debug Panel nur in Dev */}
      {process.env.NODE_ENV === "development" && <DebugPanel control={control} />}
    </form>
  );
}