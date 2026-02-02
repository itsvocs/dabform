"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";

// shadcn/ui Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Building2, AlertCircle } from "lucide-react";

interface Step5FormProps {
  systemMeta?: {
    erstellt_am?: string;
  };
}

export function Step5Form({ systemMeta }: Step5FormProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // Watch values for summary
  const patient = useWatch({ control, name: "patient" });
  const bericht = useWatch({ control, name: "bericht" });
  const krankenkasse = useWatch({ control, name: "krankenkasse" });
  const unfallbetrieb = useWatch({ control, name: "unfallbetrieb" });
  const uvTraeger = useWatch({ control, name: "uv_traeger" });

  const datenschutz = useWatch({ control, name: "bericht.datenschutz_hinweis_gegeben" });

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("de-DE");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* ZUSAMMENFASSUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Zusammenfassung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Überprüfen Sie die eingegebenen Daten
          </p>
        </div>

        <div className="md:col-span-2 space-y-4">
          {/* Patient Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">
                {patient?.vorname} {patient?.nachname}
              </p>
              <p className="text-muted-foreground">
                Geb.: {formatDate(patient?.geburtsdatum)} |
                {patient?.strasse}, {patient?.plz} {patient?.ort}
              </p>
              <p className="text-muted-foreground">
                Tätigkeit: {patient?.beschaeftigt_als || "-"}
              </p>
            </CardContent>
          </Card>

          {/* Bericht Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bericht
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lfd. Nr.:</span>
                <span className="font-medium">{bericht?.lfd_nr || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unfalltag:</span>
                <span>{formatDate(bericht?.unfalltag)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unfallort:</span>
                <span>{bericht?.unfallort || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Heilbehandlung:</span>
                <span>
                  {bericht?.heilbehandlung_art === "ambulant" && "Ambulant"}
                  {bericht?.heilbehandlung_art === "stationaer" && "Stationär"}
                  {bericht?.heilbehandlung_art === "keine" && "Keine"}
                  {!bericht?.heilbehandlung_art && "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arbeitsfähig:</span>
                <span>
                  {bericht?.arbeitsfaehig === true && <Badge variant="outline" className="bg-green-50 dark:bg-green-950">Ja</Badge>}
                  {bericht?.arbeitsfaehig === false && <Badge variant="outline" className="bg-red-50 dark:bg-red-950">Nein</Badge>}
                  {bericht?.arbeitsfaehig === null && "-"}
                </span>
              </div>
              {bericht?.ist_pflegeunfall && (
                <Badge variant="secondary">Pflegeunfall</Badge>
              )}
            </CardContent>
          </Card>

          {/* Versicherung Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Versicherung & Betrieb
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Krankenkasse:</span>
                <span>{krankenkasse?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unfallbetrieb:</span>
                <span>{unfallbetrieb?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UV-Träger:</span>
                <span>{uvTraeger?.name || "-"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ergänzungsberichte */}
          {(bericht?.ergaenzung_kopfverletzung ||
            bericht?.ergaenzung_knieverletzung ||
            bericht?.ergaenzung_schulterverletzung ||
            bericht?.ergaenzung_verbrennung) && (
              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/5 dark:border-amber-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    Ergänzungsberichte erforderlich
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {bericht?.ergaenzung_kopfverletzung && <Badge variant="outline">Kopfverletzung</Badge>}
                  {bericht?.ergaenzung_knieverletzung && <Badge variant="outline">Knieverletzung</Badge>}
                  {bericht?.ergaenzung_schulterverletzung && <Badge variant="outline">Schulterverletzung</Badge>}
                  {bericht?.ergaenzung_verbrennung && <Badge variant="outline">Verbrennung</Badge>}
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      <Separator />

      {/* WEITERE AUSFÜHRUNGEN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Weitere Ausführungen
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Seite 2 des Berichts (optional)
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Label htmlFor="weitere_ausfuehrungen">Weitere Ausführungen</Label>
              <Textarea
                id="weitere_ausfuehrungen"
                placeholder="Ergänzende Angaben, die auf Seite 1 keinen Platz fanden..."
                className="mt-2 min-h-[150px]"
                {...register("bericht.weitere_ausfuehrungen")}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* MITTEILUNG AN BEHANDELNDEN ARZT */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Mitteilung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Information an behandelnden Arzt
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="datum_mitteilung">
                Datum der Mitteilung <span className="text-destructive">*</span>
              </Label>
              <Input
                id="datum_mitteilung"
                type="date"
                className="mt-2"
                {...register("bericht.datum_mitteilung_behandelnder_arzt")}
              />
              {errors.bericht?.datum_mitteilung_behandelnder_arzt && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.datum_mitteilung_behandelnder_arzt.message}
                </p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="mitteilung_behandelnder_arzt">
                Mitteilung an behandelnden Arzt <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="mitteilung_behandelnder_arzt"
                className="mt-2 min-h-[100px]"
                {...register("bericht.mitteilung_behandelnder_arzt")}
              />
              {errors.bericht?.mitteilung_behandelnder_arzt && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bericht.mitteilung_behandelnder_arzt.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* DATENSCHUTZ */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Datenschutz
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Rechtliche Hinweise
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <Card className="bg-neutral-50 dark:bg-accent">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Gemäß § 201 SGB VII werden die Sozialdaten des Versicherten
                    (Name, Geburtsdatum, Anschrift) sowie die Unfalldaten und
                    medizinischen Befunde an den zuständigen Unfallversicherungsträger
                    übermittelt. Der Versicherte wurde über diese Datenübermittlung
                    sowie über seine Rechte nach der DSGVO informiert.
                  </p>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="datenschutz_hinweis_gegeben"
                      checked={datenschutz || false}
                      onCheckedChange={(checked) =>
                        setValue("bericht.datenschutz_hinweis_gegeben", !!checked)
                      }
                    />
                    <div>
                      <Label
                        htmlFor="datenschutz_hinweis_gegeben"
                        className="cursor-pointer font-medium"
                      >
                        Datenschutzhinweis wurde dem Patienten gegeben{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Der Patient wurde über die Datenübermittlung und seine Rechte informiert.
                      </p>
                    </div>
                  </div>
                  {errors.bericht?.datenschutz_hinweis_gegeben && (
                    <p className="text-sm text-destructive mt-2">
                      {errors.bericht.datenschutz_hinweis_gegeben.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* SYSTEM INFO */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Abschluss
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Bericht zur Übermittlung vorbereiten
          </p>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-green-50 border-green-200 dark:bg-gray-600/10 dark:border-gray-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-gray-950 p-2">
                  <FileText className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-medium text-green-400">
                    Bericht abschließen
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Nach dem Abschließen wird der Bericht als Abgeschlossen gespeichert und nicht mehr editierbar sie können den Bericht. Sie können den Bericht
                    jederzeit als Entwurf speichern und später fortsetzen.
                    Sie Können den Bericht in Dashboard als PDF oder CSV herunterladen
                  </p>
                  {systemMeta?.erstellt_am && (
                    <p className="text-xs text-green-600 mt-2">
                      Erstellt am: {systemMeta.erstellt_am}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Hints */}
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Vor dem Abschließen prüfen:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Alle Pflichtfelder ausgefüllt</li>
              <li>Patientendaten korrekt</li>
              <li>Diagnose und Behandlung dokumentiert</li>
              <li>Datenschutzhinweis bestätigt</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
