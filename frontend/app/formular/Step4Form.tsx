"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";

// shadcn/ui Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ICD10_SUGGESTIONS = [
  // Kopf / Gehirn / Gesicht
  { code: "S00.0", label: "Oberflächliche Verletzung der Kopfhaut" },
  { code: "S00.1", label: "Prellung der Augenregion" },
  { code: "S01.0", label: "Offene Wunde der Kopfhaut" },
  { code: "S02.0", label: "Fraktur der Schädelkalotte" },
  { code: "S02.2", label: "Fraktur der Nasenbeine" },
  { code: "S02.4", label: "Fraktur des Jochbeins/Maxilla" },
  { code: "S02.5", label: "Zahnfraktur" },
  { code: "S05.0", label: "Verletzung von Konjunktiva/Hornhaut" },
  { code: "S06.0", label: "Gehirnerschütterung" },
  { code: "S06.2", label: "Diffuse Hirnverletzung" },
  { code: "S06.5", label: "Traumatische Subduralblutung" },
  { code: "S06.6", label: "Traumatische Subarachnoidalblutung" },
  { code: "S09.9", label: "Nicht näher bezeichnete Verletzung des Kopfes" },

  // Hals / Thorax
  { code: "S10.9", label: "Oberflächliche Verletzung des Halses, n.n.b." },
  { code: "S11.9", label: "Offene Wunde des Halses, n.n.b." },
  { code: "S20.2", label: "Prellung des Thorax" },
  { code: "S22.3", label: "Fraktur einer Rippe" },
  { code: "S22.4", label: "Mehrfachfrakturen der Rippen" },
  { code: "S23.3", label: "Verstauchung/Zerrung der Brustwirbelsäule" },
  { code: "S27.0", label: "Traumatischer Pneumothorax" },

  // Abdomen / Becken
  { code: "S30.0", label: "Prellung der Lendenregion und des Beckens" },
  { code: "S31.0", label: "Offene Wunde der Lendenregion" },
  { code: "S32.0", label: "Fraktur eines Lendenwirbels" },
  { code: "S32.1", label: "Fraktur des Kreuzbeins" },
  { code: "S32.2", label: "Fraktur des Steißbeins" },
  { code: "S32.3", label: "Fraktur des Darmbeins" },
  { code: "S32.4", label: "Fraktur der Pfanne (Acetabulum)" },
  { code: "S32.5", label: "Fraktur des Schambeins" },
  { code: "S36.0", label: "Verletzung der Milz" },
  { code: "S36.1", label: "Verletzung der Leber oder Gallenblase" },

  // Schulter / Oberarm / Ellenbogen
  { code: "S40.0", label: "Prellung der Schulter und des Oberarms" },
  { code: "S42.0", label: "Fraktur der Klavikula" },
  { code: "S42.2", label: "Fraktur des proximalen Humerus" },
  { code: "S43.0", label: "Luxation des Schultergelenks" },
  { code: "S46.0", label: "Verletzung der Rotatorenmanschette" },
  { code: "S50.0", label: "Prellung des Ellenbogens" },
  { code: "S52.0", label: "Fraktur des proximalen Ulna (Olecranon)" },
  { code: "S52.1", label: "Fraktur des proximalen Radius" },
  { code: "S53.4", label: "Distorsion/Zerrung des Ellenbogens" },

  // Unterarm / Handgelenk / Hand / Finger
  { code: "S52.5", label: "Fraktur des distalen Radius" },
  { code: "S52.6", label: "Fraktur von distalem Radius und Ulna" },
  { code: "S60.0", label: "Prellung der Finger" },
  { code: "S60.2", label: "Prellung des Handgelenks und der Hand" },
  { code: "S61.0", label: "Offene Wunde eines Fingers" },
  { code: "S61.5", label: "Offene Wunde der Hand" },
  { code: "S62.0", label: "Fraktur des Kahnbeins (Scaphoid)" },
  { code: "S62.1", label: "Fraktur eines anderen Handwurzelknochens" },
  { code: "S62.3", label: "Fraktur eines Mittelhandknochens" },
  { code: "S62.5", label: "Fraktur des Daumens" },
  { code: "S62.6", label: "Fraktur eines anderen Fingers" },
  { code: "S63.0", label: "Luxation des Handgelenks" },
  { code: "S63.2", label: "Luxation eines Fingers" },
  { code: "S63.5", label: "Distorsion des Handgelenks" },
  { code: "S64.0", label: "Verletzung des N. ulnaris auf Handgelenk-/Handhöhe" },
  { code: "S64.1", label: "Verletzung des N. medianus auf Handgelenk-/Handhöhe" },
  { code: "S66.0", label: "Verletzung der Beugesehnen am Handgelenk/Hand" },
  { code: "S66.1", label: "Verletzung der Strecksehnen am Handgelenk/Hand" },
  { code: "S67.0", label: "Quetschung des Daumens und anderer Finger" },
  { code: "S67.8", label: "Quetschung anderer Teile des Handgelenks/der Hand" },
  { code: "T14.0", label: "Oberflächliche Verletzung an nicht näher bezeichneter Lokalisation" },
  { code: "T14.1", label: "Offene Wunde an nicht näher bezeichneter Lokalisation" },

  // Wirbelsäule / Rücken
  { code: "S13.4", label: "Distorsion der Halswirbelsäule (HWS-Distorsion)" },
  { code: "S23.0", label: "Distorsion der Brustwirbelsäule" },
  { code: "S33.5", label: "Distorsion der Lendenwirbelsäule" },
  { code: "M54.2", label: "Zervikalgie (Nackenschmerz)" },
  { code: "M54.5", label: "Kreuzschmerz" },

  // Hüfte / Oberschenkel / Knie
  { code: "S70.0", label: "Prellung der Hüfte" },
  { code: "S72.0", label: "Fraktur des Schenkelhalses" },
  { code: "S72.1", label: "Pertrochantäre Fraktur" },
  { code: "S72.3", label: "Fraktur des Femurschaftes" },
  { code: "S73.0", label: "Luxation des Hüftgelenks" },
  { code: "S80.0", label: "Prellung des Knies" },
  { code: "S81.0", label: "Offene Wunde des Knies" },
  { code: "S82.0", label: "Fraktur der Patella" },
  { code: "S82.1", label: "Fraktur der proximalen Tibia" },
  { code: "S82.2", label: "Fraktur des Tibiaschaftes" },
  { code: "S83.0", label: "Luxation der Patella" },
  { code: "S83.2", label: "Meniskusriss (akut/traumatisch)" },
  { code: "S83.5", label: "Ruptur des vorderen Kreuzbandes" },
  { code: "S83.6", label: "Ruptur des hinteren Kreuzbandes" },
  { code: "S83.4", label: "Distorsion/Zerrung des Kniegelenks" },

  // Unterschenkel / Sprunggelenk / Fuß
  { code: "S90.0", label: "Prellung des Sprunggelenks" },
  { code: "S90.3", label: "Prellung des Fußes" },
  { code: "S91.0", label: "Offene Wunde des Sprunggelenks" },
  { code: "S91.3", label: "Offene Wunde des Fußes" },
  { code: "S92.0", label: "Fraktur des Kalkaneus" },
  { code: "S92.1", label: "Fraktur des Talus" },
  { code: "S92.3", label: "Fraktur eines Mittelfußknochens" },
  { code: "S93.4", label: "Distorsion des Sprunggelenks" },
  { code: "S93.6", label: "Distorsion des Fußes" },

  // Verbrennungen / Verätzungen
  { code: "T20.0", label: "Verbrennung Kopf/Hals, Grad n.n.b." },
  { code: "T21.0", label: "Verbrennung Rumpf, Grad n.n.b." },
  { code: "T22.0", label: "Verbrennung Schulter/Oberarm, Grad n.n.b." },
  { code: "T23.0", label: "Verbrennung Handgelenk/Hand, Grad n.n.b." },
  { code: "T24.0", label: "Verbrennung Hüfte/Bein, Grad n.n.b." },
  { code: "T25.0", label: "Verbrennung Sprunggelenk/Fuß, Grad n.n.b." },
  { code: "T26.0", label: "Verbrennung des Auges/Adnexe, Grad n.n.b." },
  { code: "T30.0", label: "Verbrennung, Körperregion n.n.b." },
  { code: "T31.0", label: "Verbrennungen: <10% KOF" },

  // Vergiftungen / Medikamente / Exposition
  { code: "T36.0", label: "Vergiftung durch Penicilline" },
  { code: "T39.0", label: "Vergiftung durch Salicylate" },
  { code: "T40.2", label: "Vergiftung durch andere Opioide" },
  { code: "T42.4", label: "Vergiftung durch Benzodiazepine" },
  { code: "T50.9", label: "Vergiftung durch Arzneimittel, n.n.b." },

  // Fremdkörper / Biss / Stich
  { code: "T14.3", label: "Kontusion/Prellung, n.n.b." },
  { code: "T14.8", label: "Sonstige Verletzung, n.n.b." },
  { code: "W54", label: "Biss oder Angriff durch Hund" },
  { code: "W55", label: "Biss oder Angriff durch anderes Säugetier" },
  { code: "W57", label: "Biss oder Stich durch nichtgiftiges Insekt" },

  // Stürze / Unfälle (äußere Ursachen – optional, aber oft dokumentiert)
  { code: "W01", label: "Sturz auf gleicher Ebene durch Ausrutschen/Stolpern" },
  { code: "W10", label: "Sturz auf/aus Treppe oder Stufen" },
  { code: "W19", label: "Sturz, nicht näher bezeichnet" },
  { code: "V89.2", label: "Verkehrsunfall, Fahrzeugart n.n.b." },

  // Häufige Symptome / Beschwerden (Praxisalltag)
  { code: "R07.4", label: "Brustschmerz, n.n.b." },
  { code: "R10.4", label: "Sonstige/unspezifische Bauchschmerzen" },
  { code: "R11", label: "Übelkeit und Erbrechen" },
  { code: "R42", label: "Schwindel" },
  { code: "R51", label: "Kopfschmerz" },
  { code: "R52.0", label: "Akuter Schmerz" },
  { code: "R53", label: "Unwohlsein und Ermüdung" },
  { code: "R55", label: "Synkope und Kollaps" },

  // Muskel/Skelett – häufige Diagnosen
  { code: "M25.5", label: "Gelenkschmerz" },
  { code: "M70.6", label: "Trochanterbursitis" },
  { code: "M75.1", label: "Rotatorenmanschettenläsion" },
  { code: "M76.5", label: "Patellaspitzensyndrom" },
  { code: "M77.1", label: "Epicondylitis lateralis (Tennisellenbogen)" },

  // Wunden / Infektionen (häufig bei Verletzungen)
  { code: "L03.1", label: "Phlegmone der oberen Extremität" },
  { code: "L03.3", label: "Phlegmone der unteren Extremität" },
  { code: "L08.9", label: "Lokale Hautinfektion, n.n.b." },

  // Sonstiges – häufiges in Notfall/D-Arzt Umfeld
  { code: "T79.6", label: "Traumatisches Kompartmentsyndrom" },
  { code: "T81.0", label: "Blutung/Hämatom als Komplikation eines Eingriffs" },
  { code: "Z23", label: "Immunisierung (Impfbedarf)" },
  { code: "Z48.0", label: "Verbandswechsel/Nahtkontrolle" },
  { code: "Z09", label: "Nachuntersuchung nach Behandlung" },
];


export function Step4Form() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // Watched Values
  const handverletzung = useWatch({ control, name: "bericht.handverletzung" });
  const polytrauma = useWatch({ control, name: "bericht.polytrauma" });
  const zweifelArbeitsunfall = useWatch({ control, name: "bericht.zweifel_arbeitsunfall" });
  const heilbehandlungArt = useWatch({ control, name: "bericht.heilbehandlung_art" });
  const verletzungVav = useWatch({ control, name: "bericht.verletzung_vav" });
  const verletzungSav = useWatch({ control, name: "bericht.verletzung_sav" });
  const weiterbehandlungDurch = useWatch({ control, name: "bericht.weiterbehandlung_durch" });
  const arbeitsfaehig = useWatch({ control, name: "bericht.arbeitsfaehig" });
  const weitereAerzteNoetig = useWatch({ control, name: "bericht.weitere_aerzte_noetig" });
  const icd10Value = useWatch({ control, name: "bericht.erstdiagnose_icd10" }) ?? "";
  const [openICD, setOpenICD] = useState(false)

  // Schwere Verletzung = ICD/AO erforderlich
  const isSevereInjury = handverletzung || polytrauma;

  const getDisabledClass = (isActive: boolean) =>
    cn("transition-opacity duration-200", isActive ? "opacity-100" : "opacity-50 pointer-events-none");

  return (
    <>
      {/* SPEZIELLE VERLETZUNGEN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Spezielle Verletzungen
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Handverletzung, Polytrauma und Ergänzungsberichte
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Handverletzung */}
            <div className="col-span-full sm:col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="handverletzung"
                  checked={handverletzung || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.handverletzung", !!checked);
                    if (!checked) setValue("bericht.gebrauchshand", "");
                  }}
                />
                <Label htmlFor="handverletzung" className="cursor-pointer">
                  Handverletzung
                </Label>
              </div>
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(!!handverletzung))}>
              <Label htmlFor="gebrauchshand">
                Gebrauchshand {handverletzung && <span className="text-destructive">*</span>}
              </Label>
              <Select
                value={useWatch({ control, name: "bericht.gebrauchshand" }) ?? ""}
                onValueChange={(value) => setValue("bericht.gebrauchshand", value ?? "")}
                disabled={!handverletzung}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rechts">Rechts</SelectItem>
                  <SelectItem value="links">Links</SelectItem>
                </SelectContent>
              </Select>
              {errors.bericht?.gebrauchshand && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.gebrauchshand.message}</p>
              )}
            </div>

            {/* Polytrauma */}
            <div className="col-span-full sm:col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="polytrauma"
                  checked={polytrauma || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.polytrauma", !!checked);
                    if (!checked) setValue("bericht.iss_score", "");
                  }}
                />
                <Label htmlFor="polytrauma" className="cursor-pointer">
                  Polytrauma
                </Label>
              </div>
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(!!polytrauma))}>
              <Label htmlFor="iss_score">
                ISS-Score {polytrauma && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="iss_score"
                type="number"
                min="0"
                max="75"
                placeholder="0-75"
                className="mt-2"
                disabled={!polytrauma}
                {...register("bericht.iss_score")}
              />
              {errors.bericht?.iss_score && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.iss_score.message}</p>
              )}
            </div>

            {/* Ergänzungsberichte */}
            <div className="col-span-full">
              <Label className="mb-3 block">Ergänzungsbericht erforderlich bei:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergaenzung_kopfverletzung"
                    checked={useWatch({ control, name: "bericht.ergaenzung_kopfverletzung" }) || false}
                    onCheckedChange={(checked) => setValue("bericht.ergaenzung_kopfverletzung", !!checked)}
                  />
                  <Label htmlFor="ergaenzung_kopfverletzung" className="cursor-pointer font-normal">
                    Kopfverletzung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergaenzung_knieverletzung"
                    checked={useWatch({ control, name: "bericht.ergaenzung_knieverletzung" }) || false}
                    onCheckedChange={(checked) => setValue("bericht.ergaenzung_knieverletzung", !!checked)}
                  />
                  <Label htmlFor="ergaenzung_knieverletzung" className="cursor-pointer font-normal">
                    Knieverletzung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergaenzung_schulterverletzung"
                    checked={useWatch({ control, name: "bericht.ergaenzung_schulterverletzung" }) || false}
                    onCheckedChange={(checked) => setValue("bericht.ergaenzung_schulterverletzung", !!checked)}
                  />
                  <Label htmlFor="ergaenzung_schulterverletzung" className="cursor-pointer font-normal">
                    Schulterverletzung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergaenzung_verbrennung"
                    checked={useWatch({ control, name: "bericht.ergaenzung_verbrennung" }) || false}
                    onCheckedChange={(checked) => setValue("bericht.ergaenzung_verbrennung", !!checked)}
                  />
                  <Label htmlFor="ergaenzung_verbrennung" className="cursor-pointer font-normal">
                    Verbrennung
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* DIAGNOSE CODES */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Diagnose-Codes
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            ICD-10 und AO-Klassifikation
            {isSevereInjury && (
              <span className="text-destructive block mt-1">
                Bei Handverletzung/Polytrauma erforderlich!
              </span>
            )}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* ICD-10 Code mit Autocomplete */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="erstdiagnose_icd10">
                ICD-10 Code {isSevereInjury && <span className="text-destructive">*</span>}
              </Label>

              <div className="relative mt-2">
                <Input
                  id="erstdiagnose_icd10"
                  placeholder="z.B. S62.5"
                  autoComplete="off"
                  {...register("bericht.erstdiagnose_icd10")}
                  onFocus={() => setOpenICD(true)}
                  onBlur={() => setTimeout(() => setOpenICD(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpenICD(false);
                  }}
                />

                {/* Vorschläge */}
                {icd10Value.trim().length > 0 && openICD && (
                  <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    {ICD10_SUGGESTIONS
                      .filter((x) => {
                        const q = icd10Value.trim().toLowerCase();
                        return (
                          x.code.toLowerCase().includes(q) ||
                          x.label.toLowerCase().includes(q)
                        );
                      })
                      .slice(0, 8)
                      .map((x) => (
                        <button
                          key={x.code}
                          type="button"
                          className="flex w-full items-start gap-3 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                          onMouseDown={(e) => {
                            e.preventDefault(); // verhindert blur bevor wir setzen
                            setValue("bericht.erstdiagnose_icd10", x.code, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setOpenICD(false);
                          }}
                        >
                          <span className="font-mono font-medium">{x.code}</span>
                          <span className="text-muted-foreground">{x.label}</span>
                        </button>
                      ))}

                    {/* Falls nichts gefunden */}
                    {ICD10_SUGGESTIONS.filter((x) => {
                      const q = icd10Value.trim().toLowerCase();
                      return (
                        x.code.toLowerCase().includes(q) ||
                        x.label.toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Keine Vorschläge
                        </div>
                      )}
                  </div>
                )}
              </div>

              {errors.bericht?.erstdiagnose_icd10 && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.erstdiagnose_icd10.message}
                </p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="erstdiagnose_ao">
                AO-Klassifikation {isSevereInjury && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="erstdiagnose_ao"
                placeholder="z.B. 23-A2.1"
                className="mt-2"
                {...register("bericht.erstdiagnose_ao")}
              />
              {errors.bericht?.erstdiagnose_ao && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.erstdiagnose_ao.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* BEURTEILUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Beurteilung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            D-ärztliche Versorgung und Vorerkrankungen
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label htmlFor="art_da_versorgung">
                8. Art der D-ärztlichen Versorgung <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="art_da_versorgung"
                className="mt-2 min-h-[100px]"
                {...register("bericht.art_da_versorgung")}
              />
              {errors.bericht?.art_da_versorgung && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.art_da_versorgung.message}</p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="vorerkrankungen">
                9. Vorerkrankungen <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="vorerkrankungen"
                placeholder="Relevante Vorerkrankungen oder 'keine bekannt'"
                className="mt-2 min-h-[80px]"
                {...register("bericht.vorerkrankungen")}
              />
              {errors.bericht?.vorerkrankungen && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.vorerkrankungen.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* ZWEIFEL AN ARBEITSUNFALL */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Arbeitsunfall
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Bestehen Zweifel am Vorliegen eines Arbeitsunfalls?
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label>10. Bestehen Zweifel am Vorliegen eines Arbeitsunfalls?</Label>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="zweifel_ja"
                    checked={zweifelArbeitsunfall === true}
                    onCheckedChange={() => setValue("bericht.zweifel_arbeitsunfall", true)}
                  />
                  <Label htmlFor="zweifel_ja" className="cursor-pointer font-normal">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="zweifel_nein"
                    checked={zweifelArbeitsunfall === false}
                    onCheckedChange={() => {
                      setValue("bericht.zweifel_arbeitsunfall", false);
                      setValue("bericht.zweifel_begruendung", "");
                    }}
                  />
                  <Label htmlFor="zweifel_nein" className="cursor-pointer font-normal">Nein</Label>
                </div>
              </div>
            </div>

            <div className={cn("col-span-full", getDisabledClass(zweifelArbeitsunfall === true))}>
              <Label htmlFor="zweifel_begruendung">
                Begründung {zweifelArbeitsunfall && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="zweifel_begruendung"
                className="mt-2"
                disabled={!zweifelArbeitsunfall}
                {...register("bericht.zweifel_begruendung")}
              />
              {errors.bericht?.zweifel_begruendung && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.zweifel_begruendung.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* HEILBEHANDLUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Heilbehandlung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Art der eingeleiteten Behandlung
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label>
                11. Welche Heilbehandlung wurde eingeleitet? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={heilbehandlungArt || ""}
                onValueChange={(value) => {
                  setValue("bericht.heilbehandlung_art", value);
                  if (value !== "keine") {
                    setValue("bericht.keine_heilbehandlung_grund", "");
                  }
                }}
                className="mt-3 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ambulant" id="hb_ambulant" />
                  <Label htmlFor="hb_ambulant" className="font-normal cursor-pointer">
                    Ambulante Heilbehandlung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stationaer" id="hb_stationaer" />
                  <Label htmlFor="hb_stationaer" className="font-normal cursor-pointer">
                    Stationäre Heilbehandlung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="keine" id="hb_keine" />
                  <Label htmlFor="hb_keine" className="font-normal cursor-pointer">
                    Keine Heilbehandlung
                  </Label>
                </div>
              </RadioGroup>
              {errors.bericht?.heilbehandlung_art && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.heilbehandlung_art.message}</p>
              )}
            </div>

            <div className={cn("col-span-full", getDisabledClass(heilbehandlungArt === "keine"))}>
              <Label htmlFor="keine_heilbehandlung_grund">
                Begründung {heilbehandlungArt === "keine" && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="keine_heilbehandlung_grund"
                className="mt-2"
                disabled={heilbehandlungArt !== "keine"}
                {...register("bericht.keine_heilbehandlung_grund")}
              />
              {errors.bericht?.keine_heilbehandlung_grund && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.keine_heilbehandlung_grund.message}</p>
              )}
            </div>

            {/* VAV */}
            <div className="col-span-full sm:col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verletzung_vav"
                  checked={verletzungVav || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.verletzung_vav", !!checked);
                    if (!checked) setValue("bericht.verletzung_vav_ziffer", "");
                  }}
                />
                <Label htmlFor="verletzung_vav" className="cursor-pointer">
                  VAV-Verletzung (Verletzungsartenverfahren)
                </Label>
              </div>
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(!!verletzungVav))}>
              <Label htmlFor="verletzung_vav_ziffer">
                VAV-Ziffer {verletzungVav && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="verletzung_vav_ziffer"
                className="mt-2"
                disabled={!verletzungVav}
                {...register("bericht.verletzung_vav_ziffer")}
              />
              {errors.bericht?.verletzung_vav_ziffer && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.verletzung_vav_ziffer.message}</p>
              )}
            </div>

            {/* SAV */}
            <div className="col-span-full sm:col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verletzung_sav"
                  checked={verletzungSav || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.verletzung_sav", !!checked);
                    if (!checked) setValue("bericht.verletzung_sav_ziffer", "");
                  }}
                />
                <Label htmlFor="verletzung_sav" className="cursor-pointer">
                  SAV-Verletzung (Schwerstverletzungsartenverfahren)
                </Label>
              </div>
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(!!verletzungSav))}>
              <Label htmlFor="verletzung_sav_ziffer">
                SAV-Ziffer {verletzungSav && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="verletzung_sav_ziffer"
                className="mt-2"
                disabled={!verletzungSav}
                {...register("bericht.verletzung_sav_ziffer")}
              />
              {errors.bericht?.verletzung_sav_ziffer && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.verletzung_sav_ziffer.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* WEITERBEHANDLUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Weiterbehandlung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Wer führt die Behandlung fort?
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label>
                12. Weiterbehandlung durch <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={weiterbehandlungDurch || ""}
                onValueChange={(value) => {
                  setValue("bericht.weiterbehandlung_durch", value);
                  if (value !== "andere_arzt") {
                    setValue("bericht.anderer_arzt_name", "");
                    setValue("bericht.anderer_arzt_adresse", "");
                  }
                }}
                className="mt-3 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="durch_mich" id="wb_mich" />
                  <Label htmlFor="wb_mich" className="font-normal cursor-pointer">
                    Durch mich
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="andere_arzt" id="wb_andere" />
                  <Label htmlFor="wb_andere" className="font-normal cursor-pointer">
                    Durch anderen Arzt
                  </Label>
                </div>
              </RadioGroup>
              {errors.bericht?.weiterbehandlung_durch && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.weiterbehandlung_durch.message}</p>
              )}
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(weiterbehandlungDurch === "andere_arzt"))}>
              <Label htmlFor="anderer_arzt_name">
                Name des Arztes {weiterbehandlungDurch === "andere_arzt" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="anderer_arzt_name"
                className="mt-2"
                disabled={weiterbehandlungDurch !== "andere_arzt"}
                {...register("bericht.anderer_arzt_name")}
              />
              {errors.bericht?.anderer_arzt_name && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.anderer_arzt_name.message}</p>
              )}
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(weiterbehandlungDurch === "andere_arzt"))}>
              <Label htmlFor="anderer_arzt_adresse">
                Anschrift {weiterbehandlungDurch === "andere_arzt" && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="anderer_arzt_adresse"
                className="mt-2"
                disabled={weiterbehandlungDurch !== "andere_arzt"}
                {...register("bericht.anderer_arzt_adresse")}
              />
              {errors.bericht?.anderer_arzt_adresse && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.anderer_arzt_adresse.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* ARBEITSFÄHIGKEIT */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Arbeitsfähigkeit
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Ist der Patient arbeitsfähig?
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label>
                13. Arbeitsfähigkeit <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={arbeitsfaehig === true ? "ja" : arbeitsfaehig === false ? "nein" : ""}
                onValueChange={(value) => {
                  const isAf = value === "ja";
                  setValue("bericht.arbeitsfaehig", isAf);
                  if (isAf) {
                    setValue("bericht.arbeitsunfaehig_ab", "");
                    setValue("bericht.arbeitsfaehig_ab", "");
                    setValue("bericht.au_laenger_3_monate", false);
                  }
                }}
                className="mt-3 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="af_ja" />
                  <Label htmlFor="af_ja" className="font-normal cursor-pointer">
                    Arbeitsfähig
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nein" id="af_nein" />
                  <Label htmlFor="af_nein" className="font-normal cursor-pointer">
                    Arbeitsunfähig
                  </Label>
                </div>
              </RadioGroup>
              {errors.bericht?.arbeitsfaehig && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.arbeitsfaehig.message}</p>
              )}
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(arbeitsfaehig === false))}>
              <Label htmlFor="arbeitsunfaehig_ab">
                Arbeitsunfähig ab {arbeitsfaehig === false && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="arbeitsunfaehig_ab"
                type="date"
                className="mt-2"
                disabled={arbeitsfaehig !== false}
                {...register("bericht.arbeitsunfaehig_ab")}
              />
              {errors.bericht?.arbeitsunfaehig_ab && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.arbeitsunfaehig_ab.message}</p>
              )}
            </div>

            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(arbeitsfaehig === false))}>
              <Label htmlFor="arbeitsfaehig_ab">
                Voraussichtlich arbeitsfähig ab {arbeitsfaehig === false && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="arbeitsfaehig_ab"
                type="date"
                className="mt-2"
                disabled={arbeitsfaehig !== false}
                {...register("bericht.arbeitsfaehig_ab")}
              />
              {errors.bericht?.arbeitsfaehig_ab && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.arbeitsfaehig_ab.message}</p>
              )}
            </div>

            <div className={cn("col-span-full", getDisabledClass(arbeitsfaehig === false))}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="au_laenger_3_monate"
                  checked={useWatch({ control, name: "bericht.au_laenger_3_monate" }) || false}
                  onCheckedChange={(checked) => setValue("bericht.au_laenger_3_monate", !!checked)}
                  disabled={arbeitsfaehig !== false}
                />
                <Label htmlFor="au_laenger_3_monate" className="cursor-pointer">
                  Arbeitsunfähigkeit voraussichtlich länger als 3 Monate
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* WEITERE ÄRZTE */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Weitere Ärzte
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Konsultation weiterer Fachärzte
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weitere_aerzte_noetig"
                  checked={weitereAerzteNoetig || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.weitere_aerzte_noetig", !!checked);
                    if (!checked) setValue("bericht.weitere_aerzte_namen", "");
                  }}
                />
                <Label htmlFor="weitere_aerzte_noetig" className="cursor-pointer">
                  14. Hinzuziehung weiterer Ärzte erforderlich
                </Label>
              </div>
            </div>

            <div className={cn("col-span-full", getDisabledClass(!!weitereAerzteNoetig))}>
              <Label htmlFor="weitere_aerzte_namen">
                Name/Fachgebiet {weitereAerzteNoetig && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="weitere_aerzte_namen"
                className="mt-2"
                disabled={!weitereAerzteNoetig}
                {...register("bericht.weitere_aerzte_namen")}
              />
              {errors.bericht?.weitere_aerzte_namen && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.weitere_aerzte_namen.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* WIEDERVORSTELLUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Wiedervorstellung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Nächster Termin
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="wiedervorstellung_datum">
                15. Wiedervorstellung am <span className="text-destructive">*</span>
              </Label>
              <Input
                id="wiedervorstellung_datum"
                type="date"
                className="mt-2"
                {...register("bericht.wiedervorstellung_datum")}
              />
              {errors.bericht?.wiedervorstellung_datum && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.wiedervorstellung_datum.message}</p>
              )}
            </div>

            <div className="col-span-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wiedervorstellung_mitgeteilt"
                  checked={useWatch({ control, name: "bericht.wiedervorstellung_mitgeteilt" }) || false}
                  onCheckedChange={(checked) => setValue("bericht.wiedervorstellung_mitgeteilt", !!checked)}
                />
                <Label htmlFor="wiedervorstellung_mitgeteilt" className="cursor-pointer">
                  Dem Patienten mitgeteilt <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.bericht?.wiedervorstellung_mitgeteilt && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.wiedervorstellung_mitgeteilt.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* BEMERKUNGEN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Bemerkungen
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sonstige Anmerkungen
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label htmlFor="bemerkungen">16. Bemerkungen</Label>
              <Textarea
                id="bemerkungen"
                className="mt-2 min-h-[100px]"
                {...register("bericht.bemerkungen")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
