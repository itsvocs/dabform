"use client";

import { useState, useEffect, Fragment } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
import { patientenApi } from "@/lib/api";
import type { Patient } from "@/types";

// shadcn/ui Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from "@/components/ui/command";
import { Check, UserPlus, Search, ArrowUpIcon, ArrowDownIcon, CornerDownLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface Step1FormProps {
  onPatientSelect: (id: number | null) => void;
  selectedPatientId: number | null;
}

export function Step1Form({ onPatientSelect, selectedPatientId }: Step1FormProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // Patient Search State
  const [patientSearch, setPatientSearch] = useState("");
  const [patientOptions, setPatientOptions] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(!selectedPatientId);

  // Patient suchen
  useEffect(() => {
    if (patientSearch.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await patientenApi.search(patientSearch);
          setPatientOptions(results);
        } catch (e) {
          console.error("Patient-Suche fehlgeschlagen:", e);
        } finally {
          setIsSearching(false);
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setPatientOptions([]);
      setIsSearching(false)
    }
  }, [patientSearch]);

  // Patient auswählen und Felder füllen
  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient.id);
    setIsNewPatient(false);
    setPatientPopoverOpen(false);

    // Alle Felder setzen
    setValue("patient.id", patient.id);
    setValue("patient.vorname", patient.vorname);
    setValue("patient.nachname", patient.nachname);
    setValue("patient.geburtsdatum", patient.geburtsdatum);
    setValue("patient.geschlecht", patient.geschlecht || "");
    setValue("patient.telefon", patient.telefon || "");
    setValue("patient.staatsangehoerigkeit", patient.staatsangehoerigkeit || "");
    setValue("patient.strasse", patient.strasse || "");
    setValue("patient.plz", patient.plz || "");
    setValue("patient.ort", patient.ort || "");
    setValue("patient.beschaeftigt_als", patient.beschaeftigt_als || "");
    setValue("patient.beschaeftigt_seit", patient.beschaeftigt_seit || "");
    setValue("patient.familienversichert", patient.familienversichert || false);
    setValue("patient.familienversichert_name", patient.familienversichert_name || "");
    setValue("patient.pflegekasse", patient.pflegekasse || "");
  };

  // Neuen Patienten anlegen
  const handleNewPatient = () => {
    onPatientSelect(null);
    setIsNewPatient(true);
    setPatientPopoverOpen(false);

    // Felder zurücksetzen
    setValue("patient.id", undefined);
    setValue("patient.vorname", "");
    setValue("patient.nachname", "");
    setValue("patient.geburtsdatum", "");
    setValue("patient.geschlecht", "");
    setValue("patient.telefon", "");
    setValue("patient.staatsangehoerigkeit", "");
    setValue("patient.strasse", "");
    setValue("patient.plz", "");
    setValue("patient.ort", "");
    setValue("patient.beschaeftigt_als", "");
    setValue("patient.beschaeftigt_seit", "");
    setValue("patient.familienversichert", false);
    setValue("patient.familienversichert_name", "");
    setValue("patient.pflegekasse", "");
  };

  // Watched Values
  const watchedVorname = useWatch({ control, name: "patient.vorname" });
  const watchedNachname = useWatch({ control, name: "patient.nachname" });

  return (
    <>
      {/* KOPFDATEN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Durchgangsarztbericht
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            für die UV-Träger
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="lfd_nr">
                Lfd. Nr. <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lfd_nr"
                placeholder="202X-..."
                className="mt-2"
                {...register("bericht.lfd_nr")}
              />
              {errors.bericht?.lfd_nr && (
                <p className="text-sm text-destructive mt-1">{errors.bericht.lfd_nr.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* PATIENT SUCHE */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Patient
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Existierenden Patienten suchen oder neuen anlegen
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-col gap-4">
            {/* Patient Suche Popover */}
            <div className="flex gap-3 flex-wrap">
              <CommandDialog open={patientPopoverOpen} onOpenChange={setPatientPopoverOpen}>
                <CommandDialogTrigger render={<Button variant="outline" className="w-full sm:w-80 justify-between" />}>
                  {selectedPatientId && watchedVorname ? (
                    <span>
                      {watchedVorname} {" "}{watchedNachname}
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Patienten suchen...
                    </span>
                  )}
                </CommandDialogTrigger>
                <CommandDialogPopup>
                  <Command open>
                    <CommandInput
                      placeholder="Name eingeben..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                    />
                    <CommandPanel>
                      {!isSearching && patientOptions.length === 0 && (
                        <CommandEmpty>Keine Patienten gefunden.</CommandEmpty>
                      )}
                      <CommandList>
                        <Fragment>
                          {isSearching ? (
                            <div className="flex items-center justify-center py-6">
                              <Spinner className="text-muted-foreground" />
                            </div>
                          ) : (
                            <CommandGroup items={patientOptions}>
                              {patientOptions.map((patient) => (
                                <CommandItem
                                  key={patient.id}
                                  value={patient.id.toString()}
                                  onClick={() => handlePatientSelect(patient)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="flex-1"> {patient.vorname} {" "}{patient.nachname}</span>
                                    <span className="text-xs text-muted-foreground">Geburtsdatum: {new Date(patient.geburtsdatum).toLocaleDateString("de-DE")}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </Fragment>
                      </CommandList>
                    </CommandPanel>
                    <CommandFooter>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <KbdGroup>
                            <Kbd>
                              <ArrowUpIcon />
                            </Kbd>
                            <Kbd>
                              <ArrowDownIcon />
                            </Kbd>
                          </KbdGroup>
                          <span>Navigieren</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Kbd>
                            <CornerDownLeftIcon />
                          </Kbd>
                          <span>Öffnen</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Kbd>Esc</Kbd>
                        <span>Schließen</span>
                      </div>
                    </CommandFooter>
                  </Command>
                </CommandDialogPopup>
              </CommandDialog>

              <Button
                type="button"
                variant={isNewPatient ? "default" : "outline"}
                onClick={handleNewPatient}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Neu
              </Button>
            </div>

            {selectedPatientId && !isNewPatient && (
              <p className="text-sm text-muted-foreground">
                Patient ausgewählt mit der ID: {selectedPatientId}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* STAMMDATEN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Stammdaten
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Persönliche Daten des Patienten
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Vorname */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="vorname">
                Vorname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vorname"
                placeholder="Emma"
                className="mt-2"
                {...register("patient.vorname")}
              />
              {errors.patient?.vorname && (
                <p className="text-sm text-destructive mt-1">{errors.patient.vorname.message}</p>
              )}
            </div>

            {/* Nachname */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="nachname">
                Nachname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nachname"
                placeholder="Crown"
                className="mt-2"
                {...register("patient.nachname")}
              />
              {errors.patient?.nachname && (
                <p className="text-sm text-destructive mt-1">{errors.patient.nachname.message}</p>
              )}
            </div>

            {/* Geburtsdatum */}
            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="geburtsdatum">
                Geburtsdatum <span className="text-destructive">*</span>
              </Label>
              <Input
                id="geburtsdatum"
                type="date"
                className="mt-2"
                {...register("patient.geburtsdatum")}
              />
              {errors.patient?.geburtsdatum && (
                <p className="text-sm text-destructive mt-1">{errors.patient.geburtsdatum.message}</p>
              )}
            </div>

            {/* Geschlecht */}
            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="geschlecht">
                Geschlecht <span className="text-destructive">*</span>
              </Label>
              <Select
                aria-label="Geschlecht auswählen "
                value={useWatch({ control, name: "patient.geschlecht" }) ?? ""}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onValueChange={(value, _) => setValue("patient.geschlecht", value ?? "")}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">Männlich</SelectItem>
                  <SelectItem value="w">Weiblich</SelectItem>
                  <SelectItem value="d">Divers</SelectItem>
                </SelectContent>
              </Select>
              {errors.patient?.geschlecht && (
                <p className="text-sm text-destructive mt-1">{errors.patient.geschlecht.message}</p>
              )}
            </div>

            {/* Staatsangehörigkeit */}
            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="staatsangehoerigkeit">
                Staatsangehörigkeit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="staatsangehoerigkeit"
                placeholder="Deutsch"
                className="mt-2"
                {...register("patient.staatsangehoerigkeit")}
              />
              {errors.patient?.staatsangehoerigkeit && (
                <p className="text-sm text-destructive mt-1">{errors.patient.staatsangehoerigkeit.message}</p>
              )}
            </div>

            {/* Telefon */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="telefon">
                Telefonnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telefon"
                placeholder="0176 12345678"
                className="mt-2"
                {...register("patient.telefon")}
              />
              {errors.patient?.telefon && (
                <p className="text-sm text-destructive mt-1">{errors.patient.telefon.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* ANSCHRIFT */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Anschrift
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Wohnort des Patienten
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Straße */}
            <div className="col-span-full">
              <Label htmlFor="strasse">
                Straße & Hausnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="strasse"
                placeholder="Berliner Str. 243"
                className="mt-2"
                {...register("patient.strasse")}
              />
              {errors.patient?.strasse && (
                <p className="text-sm text-destructive mt-1">{errors.patient.strasse.message}</p>
              )}
            </div>

            {/* PLZ */}
            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="plz">
                PLZ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="plz"
                placeholder="35390"
                className="mt-2"
                {...register("patient.plz")}
              />
              {errors.patient?.plz && (
                <p className="text-sm text-destructive mt-1">{errors.patient.plz.message}</p>
              )}
            </div>

            {/* Ort */}
            <div className="col-span-full sm:col-span-4">
              <Label htmlFor="ort">
                Ort <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ort"
                placeholder="Gießen"
                className="mt-2"
                {...register("patient.ort")}
              />
              {errors.patient?.ort && (
                <p className="text-sm text-destructive mt-1">{errors.patient.ort.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* BESCHÄFTIGUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Beschäftigung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Berufliche Situation
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Tätigkeit */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="beschaeftigt_als">
                Beschäftigt als <span className="text-destructive">*</span>
              </Label>
              <Input
                id="beschaeftigt_als"
                placeholder="Senior Manager"
                className="mt-2"
                {...register("patient.beschaeftigt_als")}
              />
              {errors.patient?.beschaeftigt_als && (
                <p className="text-sm text-destructive mt-1">{errors.patient.beschaeftigt_als.message}</p>
              )}
            </div>

            {/* Seit */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="beschaeftigt_seit">Beschäftigt seit</Label>
              <Input
                id="beschaeftigt_seit"
                type="date"
                className="mt-2"
                {...register("patient.beschaeftigt_seit")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
