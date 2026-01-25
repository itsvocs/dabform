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
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="erstdiagnose_icd10">
                ICD-10 Code {isSevereInjury && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="erstdiagnose_icd10"
                placeholder="z.B. S62.5"
                className="mt-2"
                {...register("bericht.erstdiagnose_icd10")}
              />
              {errors.bericht?.erstdiagnose_icd10 && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.erstdiagnose_icd10.message}</p>
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
