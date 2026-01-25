"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";

// shadcn/ui Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function Step3Form() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // Watched Values
  const verdachtAlkohol = useWatch({ control, name: "bericht.verdacht_alkohol_drogen" });
  const blutentnahme = useWatch({ control, name: "bericht.blutentnahme_durchgefuehrt" });

  const getDisabledClass = (isActive: boolean) =>
    cn("transition-opacity duration-200", isActive ? "opacity-100" : "opacity-50 pointer-events-none");

  return (
    <>
      {/* UNFALLHERGANG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Unfallhergang
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Wann, wo und wie ist der Unfall passiert?
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="unfalltag">
                1. Unfalltag <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unfalltag"
                type="date"
                className="mt-2"
                {...register("bericht.unfalltag")}
              />
              {errors.bericht?.unfalltag && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.unfalltag.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="unfallzeit">
                Unfallzeit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unfallzeit"
                type="time"
                className="mt-2"
                {...register("bericht.unfallzeit")}
              />
              {errors.bericht?.unfallzeit && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.unfallzeit.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="arbeitszeit_beginn">Arbeitsbeginn am</Label>
              <Input
                id="arbeitszeit_beginn"
                type="time"
                className="mt-2"
                {...register("bericht.arbeitszeit_beginn")}
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="arbeitszeit_ende">Arbeitsende am</Label>
              <Input
                id="arbeitszeit_ende"
                type="time"
                className="mt-2"
                {...register("bericht.arbeitszeit_ende")}
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="unfallort">
                Unfallort <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unfallort"
                placeholder="Gebäude, Raum, Straße …"
                className="mt-2"
                {...register("bericht.unfallort")}
              />
              {errors.bericht?.unfallort && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.unfallort.message}</p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="unfallhergang">
                2. Angaben zum Unfallhergang <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Angaben der versicherten Person zum Unfallhergang und zur Tätigkeit
              </p>
              <Textarea
                id="unfallhergang"
                className="mt-2 min-h-[120px]"
                {...register("bericht.unfallhergang")}
              />
              {errors.bericht?.unfallhergang && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.unfallhergang.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* ERSTVERSORGUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Erstversorgung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Maßnahmen unmittelbar nach dem Unfall
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label htmlFor="verhalten_nach_unfall">
                3. Verhalten nach dem Unfall <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="verhalten_nach_unfall"
                className="mt-2 min-h-[80px]"
                {...register("bericht.verhalten_nach_unfall")}
              />
              {errors.bericht?.verhalten_nach_unfall && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.verhalten_nach_unfall.message}
                </p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="art_erstversorgung">
                4.1 Art der ersten Versorgung <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="art_erstversorgung"
                className="mt-2 min-h-[80px]"
                {...register("bericht.art_erstversorgung")}
              />
              {errors.bericht?.art_erstversorgung && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.art_erstversorgung.message}
                </p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="erstbehandlung_datum">
                4.2 Erstmalig behandelt am <span className="text-destructive">*</span>
              </Label>
              <Input
                id="erstbehandlung_datum"
                type="date"
                className="mt-2"
                {...register("bericht.erstbehandlung_datum")}
              />
              {errors.bericht?.erstbehandlung_datum && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.erstbehandlung_datum.message}
                </p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="erstbehandlung_durch">
                Durch (Arzt / Einrichtung) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="erstbehandlung_durch"
                className="mt-2"
                {...register("bericht.erstbehandlung_durch")}
              />
              {errors.bericht?.erstbehandlung_durch && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.erstbehandlung_durch.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* BEFUNDE */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Befunde und Diagnose
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Medizinische Feststellungen
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Alkohol/Drogen Verdacht */}
            <div className="col-span-full sm:col-span-3">
              <Label>5. Verdacht auf Alkohol/Drogen?</Label>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alkohol_ja"
                    checked={verdachtAlkohol === true}
                    onCheckedChange={() =>
                      setValue("bericht.verdacht_alkohol_drogen", true, { shouldValidate: true })
                    }
                  />
                  <Label htmlFor="alkohol_ja" className="cursor-pointer font-normal">
                    Ja
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alkohol_nein"
                    checked={verdachtAlkohol === false}
                    onCheckedChange={() => {
                      setValue("bericht.verdacht_alkohol_drogen", false, { shouldValidate: true });
                      setValue("bericht.alkohol_drogen_anzeichen", "");
                      setValue("bericht.blutentnahme_durchgefuehrt", false);
                    }}
                  />
                  <Label htmlFor="alkohol_nein" className="cursor-pointer font-normal">
                    Nein
                  </Label>
                </div>
              </div>
            </div>

            {/* Anzeichen */}
            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(verdachtAlkohol === true))}>
              <Label htmlFor="alkohol_anzeichen">
                Welche Anzeichen? {verdachtAlkohol && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="alkohol_anzeichen"
                placeholder="Geruch, Verhalten..."
                className="mt-2"
                disabled={!verdachtAlkohol}
                {...register("bericht.alkohol_drogen_anzeichen")}
              />
              {errors.bericht?.alkohol_drogen_anzeichen && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.alkohol_drogen_anzeichen.message}
                </p>
              )}
            </div>

            {/* Blutentnahme */}
            <div className={cn("col-span-full sm:col-span-3", getDisabledClass(verdachtAlkohol === true))}>
              <Label>Blutentnahme durchgeführt?</Label>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blut_ja"
                    checked={blutentnahme === true}
                    onCheckedChange={() => setValue("bericht.blutentnahme_durchgefuehrt", true)}
                    disabled={!verdachtAlkohol}
                  />
                  <Label htmlFor="blut_ja" className="cursor-pointer font-normal">
                    Ja
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blut_nein"
                    checked={blutentnahme === false}
                    onCheckedChange={() => setValue("bericht.blutentnahme_durchgefuehrt", false)}
                    disabled={!verdachtAlkohol}
                  />
                  <Label htmlFor="blut_nein" className="cursor-pointer font-normal">
                    Nein
                  </Label>
                </div>
              </div>
            </div>

            {/* Klinische Befunde */}
            <div className="col-span-full">
              <Label htmlFor="klinische_befunde">5.2 Klinische Untersuchungsbefunde</Label>
              <Textarea
                id="klinische_befunde"
                className="mt-2 min-h-[100px]"
                {...register("bericht.klinische_befunde")}
              />
            </div>

            {/* Bildgebende Diagnostik */}
            <div className="col-span-full">
              <Label htmlFor="bildgebende_diagnostik">6. Ergebnis bildgebender Diagnostik</Label>
              <Textarea
                id="bildgebende_diagnostik"
                className="mt-2 min-h-[100px]"
                {...register("bericht.bildgebende_diagnostik")}
              />
            </div>

            {/* Erstdiagnose */}
            <div className="col-span-full">
              <Label htmlFor="erstdiagnose_freitext">7. Erstdiagnose (Freitext)</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Bei Frakturen AO-Klassifikation angeben
              </p>
              <Textarea
                id="erstdiagnose_freitext"
                className="mt-2 min-h-[100px]"
                {...register("bericht.erstdiagnose_freitext")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
