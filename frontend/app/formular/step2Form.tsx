"use client";

import { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ReportFormValues } from "./schemas";
import { krankenkassenApi, unfallbetriebeApi, uvTraegerApi } from "@/lib/api";
import type { Krankenkasse, Unfallbetrieb, UVTraeger } from "@/types";

// shadcn/ui Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverPopup,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface Step2FormProps {
  onKrankenkasseSelect: (id: number | null) => void;
  onUnfallbetriebSelect: (id: number | null) => void;
  onUvTraegerSelect: (id: number | null) => void;
  selectedKrankenkasseId: number | null;
  selectedUnfallbetriebId: number | null;
  selectedUvTraegerId: number | null;
}

export function Step2Form({
  onKrankenkasseSelect,
  onUnfallbetriebSelect,
  onUvTraegerSelect,
  selectedKrankenkasseId,
  selectedUnfallbetriebId,
  selectedUvTraegerId,
}: Step2FormProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  // Watch Values
  const istPflegeunfall = useWatch({ control, name: "bericht.ist_pflegeunfall" });
  const istFamilienversichert = useWatch({ control, name: "patient.familienversichert" });

  // ===== KRANKENKASSE SEARCH =====
  const [kkSearch, setKkSearch] = useState("");
  const [kkOptions, setKkOptions] = useState<Krankenkasse[]>([]);
  const [kkSearching, setKkSearching] = useState(false);
  const [kkOpen, setKkOpen] = useState(false);
  const [isNewKK, setIsNewKK] = useState(!selectedKrankenkasseId);

  useEffect(() => {
    if (kkSearch.length >= 2) {
      setKkSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await krankenkassenApi.search(kkSearch);
          setKkOptions(results);
        } catch (e) {
          console.error("KK-Suche fehlgeschlagen:", e);
        } finally {
          setKkSearching(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setKkSearching(false)
    }
  }, [kkSearch]);

  const handleKKSelect = (kk: Krankenkasse) => {
    onKrankenkasseSelect(kk.id);
    setIsNewKK(false);
    setKkOpen(false);
    setValue("krankenkasse.id", kk.id);
    setValue("krankenkasse.name", kk.name);
    setValue("krankenkasse.kuerzel", kk.kuerzel);
    setValue("krankenkasse.ik_nummer", kk.ik_nummer);
  };

  const handleNewKK = () => {
    onKrankenkasseSelect(null);
    setIsNewKK(true);
    setKkOpen(false);
    setValue("krankenkasse.id", undefined);
    setValue("krankenkasse.name", "");
    setValue("krankenkasse.kuerzel", "");
    setValue("krankenkasse.ik_nummer", "");
  };

  // ===== UNFALLBETRIEB SEARCH =====
  const [ubSearch, setUbSearch] = useState("");
  const [ubOptions, setUbOptions] = useState<Unfallbetrieb[]>([]);
  const [ubSearching, setUbSearching] = useState(false);
  const [ubOpen, setUbOpen] = useState(false);
  const [isNewUB, setIsNewUB] = useState(!selectedUnfallbetriebId);

  useEffect(() => {
    if (ubSearch.length >= 2) {
      setUbSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await unfallbetriebeApi.search(ubSearch);
          setUbOptions(results);
        } catch (e) {
          console.error("UB-Suche fehlgeschlagen:", e);
        } finally {
          setUbSearching(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setUbSearching(false);
    }
  }, [ubSearch]);

  const handleUBSelect = (ub: Unfallbetrieb) => {
    onUnfallbetriebSelect(ub.id);
    setIsNewUB(false);
    setUbOpen(false);
    setValue("unfallbetrieb.id", ub.id);
    setValue("unfallbetrieb.name", ub.name);
    setValue("unfallbetrieb.strasse", ub.strasse || "");
    setValue("unfallbetrieb.plz", ub.plz || "");
    setValue("unfallbetrieb.ort", ub.ort || "");
    setValue("unfallbetrieb.telefon", ub.telefon || "");
    setValue("unfallbetrieb.branche", ub.branche || "");
  };

  const handleNewUB = () => {
    onUnfallbetriebSelect(null);
    setIsNewUB(true);
    setUbOpen(false);
    setValue("unfallbetrieb.id", undefined);
    setValue("unfallbetrieb.name", "");
    setValue("unfallbetrieb.strasse", "");
    setValue("unfallbetrieb.plz", "");
    setValue("unfallbetrieb.ort", "");
    setValue("unfallbetrieb.telefon", "");
    setValue("unfallbetrieb.branche", "");
  };

  // ===== UV-TRÄGER SEARCH =====
  const [uvSearch, setUvSearch] = useState("");
  const [uvOptions, setUvOptions] = useState<UVTraeger[]>([]);
  const [uvSearching, setUvSearching] = useState(false);
  const [uvOpen, setUvOpen] = useState(false);
  const [isNewUV, setIsNewUV] = useState(!selectedUvTraegerId);

  useEffect(() => {
    if (uvSearch.length >= 2) {
      setUvSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await uvTraegerApi.search(uvSearch);
          setUvOptions(results);
        } catch (e) {
          console.error("UV-Suche fehlgeschlagen:", e);
        } finally {
          setUvSearching(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setUvSearching(false)
    }
  }, [uvSearch]);

  const handleUVSelect = (uv: UVTraeger) => {
    onUvTraegerSelect(uv.id);
    setIsNewUV(false);
    setUvOpen(false);
    setValue("uv_traeger.id", uv.id);
    setValue("uv_traeger.name", uv.name);
    setValue("uv_traeger.kuerzel", uv.kuerzel);
    setValue("uv_traeger.adresse", uv.adresse || "");
    setValue("uv_traeger.telefon", uv.telefon || "");
    setValue("uv_traeger.email", uv.email || "");
  };

  const handleNewUV = () => {
    onUvTraegerSelect(null);
    setIsNewUV(true);
    setUvOpen(false);
    setValue("uv_traeger.id", undefined);
    setValue("uv_traeger.name", "");
    setValue("uv_traeger.kuerzel", "");
    setValue("uv_traeger.adresse", "");
    setValue("uv_traeger.telefon", "");
    setValue("uv_traeger.email", "");
  };

  // Watched Names for display
  const kkName = useWatch({ control, name: "krankenkasse.name" });
  const ubName = useWatch({ control, name: "unfallbetrieb.name" });
  const uvName = useWatch({ control, name: "uv_traeger.name" });

  return (
    <>
      {/* VERSICHERUNG */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Versicherung
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Krankenversicherung des Patienten
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

            {/* Krankenkasse Suche */}
            <div className="col-span-full">
              <Label>Krankenkasse suchen oder neu anlegen</Label>
              <div className="flex gap-3 mt-2">
                <Popover open={kkOpen} onOpenChange={setKkOpen}>
                  <PopoverTrigger render={<Button variant="outline" className="w-80 justify-between" />}>
                    {selectedKrankenkasseId && kkName ? (
                      <span>{kkName}</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-2">
                        Krankenkasse suchen...
                      </span>
                    )}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverPopup className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Name oder IK-Nummer..."
                        value={kkSearch}
                        onChange={(e) => setKkSearch(e.target.value)}
                      />
                      {
                        !kkSearching && kkOptions.length === 0 &&
                        <CommandEmpty>Keine Krankenkassen gefunden.</CommandEmpty>
                      }
                      <CommandList>
                        {kkSearching ? (
                          <div className="flex items-center justify-center py-6 text-muted-foreground">
                            <Spinner />
                          </div>
                        ) : (
                          <>
                            <CommandGroup>
                              {kkOptions.map((kk) => (
                                <CommandItem
                                  key={kk.id}
                                  onClick={() => handleKKSelect(kk)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedKrankenkasseId === kk.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{kk.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      IK: {kk.ik_nummer}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverPopup>
                </Popover>
                <Button
                  type="button"
                  variant={isNewKK ? "default" : "outline"}
                  onClick={handleNewKK}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Krankenkasse Felder */}
            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="kk_name">
                Krankenkasse <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kk_name"
                placeholder="AOK Hessen"
                className="mt-2"
                {...register("krankenkasse.name")}
              />
              {errors.krankenkasse?.name && (
                <p className="text-sm text-destructive mt-1">{errors.krankenkasse.name.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="kk_kuerzel">
                Kürzel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kk_kuerzel"
                placeholder="AOK"
                className="mt-2"
                {...register("krankenkasse.kuerzel")}
              />
              {errors.krankenkasse?.kuerzel && (
                <p className="text-sm text-destructive mt-1">{errors.krankenkasse.kuerzel.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="ik_nummer">
                IK-Nummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ik_nummer"
                placeholder="10XXXXXXX"
                className="mt-2"
                {...register("krankenkasse.ik_nummer")}
              />
              {errors.krankenkasse?.ik_nummer && (
                <p className="text-sm text-destructive mt-1">{errors.krankenkasse.ik_nummer.message}</p>
              )}
            </div>

            {/* Familienversichert */}
            <div className="col-span-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="familienversichert"
                  checked={istFamilienversichert || false}
                  onCheckedChange={(checked) => {
                    setValue("patient.familienversichert", !!checked);
                    if (!checked) {
                      setValue("patient.familienversichert_name", "");
                    }
                  }}
                />
                <Label htmlFor="familienversichert" className="cursor-pointer">
                  Patient ist familienversichert
                </Label>
              </div>
            </div>

            {istFamilienversichert && (
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor="fv_name">
                  Name des Hauptversicherten <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fv_name"
                  placeholder="Vorname Nachname"
                  className="mt-2"
                  {...register("patient.familienversichert_name")}
                />
                {errors.patient?.familienversichert_name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.patient.familienversichert_name.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* PFLEGEUNFALL */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Pflegeunfall
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Gesetzliche Sonderangaben
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ist_pflegeunfall"
                  checked={istPflegeunfall || false}
                  onCheckedChange={(checked) => {
                    setValue("bericht.ist_pflegeunfall", !!checked);
                    if (!checked) {
                      setValue("patient.pflegekasse", "");
                    }
                  }}
                />
                <Label htmlFor="ist_pflegeunfall" className="cursor-pointer">
                  Handelt es sich um einen Pflegeunfall?
                </Label>
              </div>
            </div>

            {istPflegeunfall && (
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor="pflegekasse">
                  Pflegekasse <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pflegekasse"
                  placeholder="z. B. AOK Pflegekasse"
                  className="mt-2"
                  {...register("patient.pflegekasse")}
                />
                {errors.patient?.pflegekasse && (
                  <p className="text-sm text-destructive mt-1">{errors.patient.pflegekasse.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* UNFALLBETRIEB */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Unfallbetrieb
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Angaben zum Arbeitgeber
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

            {/* Unfallbetrieb Suche */}
            <div className="col-span-full">
              <Label>Unfallbetrieb suchen oder neu anlegen</Label>
              <div className="flex gap-3 mt-2">
                <Popover open={ubOpen} onOpenChange={setUbOpen}>
                  <PopoverTrigger render={<Button variant="outline" className="w-80 justify-between" />}>

                    {selectedUnfallbetriebId && ubName ? (
                      <span>{ubName}</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-2">
                        Betrieb suchen...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Name oder Ort..."
                        value={ubSearch}
                        onChange={(e) => { setUbSearch(e.target.value) }}
                      />
                      <CommandList>
                        {!ubSearching && ubOptions.length === 0 &&
                          <CommandEmpty>Keine Betriebe gefunden.</CommandEmpty>}
                        {ubSearching ? (
                          <div className="flex items-center justify-center py-6">
                            <Spinner />
                          </div>
                        ) : (
                          <>
                            <CommandGroup>
                              {ubOptions.map((ub) => (
                                <CommandItem key={ub.id} onClick={() => handleUBSelect(ub)}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUnfallbetriebId === ub.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{ub.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {ub.ort}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button type="button" variant={isNewUB ? "default" : "outline"} onClick={handleNewUB}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="ub_name">
                Name des Unternehmens <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_name"
                placeholder="Musterfirma GmbH"
                className="mt-2"
                {...register("unfallbetrieb.name")}
              />
              {errors.unfallbetrieb?.name && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.name.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="ub_strasse">
                Straße <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_strasse"
                placeholder="Berliner Str. 243"
                className="mt-2"
                {...register("unfallbetrieb.strasse")}
              />
              {errors.unfallbetrieb?.strasse && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.strasse.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="ub_plz">
                PLZ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_plz"
                placeholder="35390"
                className="mt-2"
                {...register("unfallbetrieb.plz")}
              />
              {errors.unfallbetrieb?.plz && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.plz.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="ub_ort">
                Ort <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_ort"
                placeholder="Gießen"
                className="mt-2"
                {...register("unfallbetrieb.ort")}
              />
              {errors.unfallbetrieb?.ort && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.ort.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="ub_telefon">
                Telefon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_telefon"
                placeholder="0641 123456"
                className="mt-2"
                {...register("unfallbetrieb.telefon")}
              />
              {errors.unfallbetrieb?.telefon && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.telefon.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="ub_branche">
                Branche <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ub_branche"
                placeholder="z. B. Bauhauptgewerbe"
                className="mt-2"
                {...register("unfallbetrieb.branche")}
              />
              {errors.unfallbetrieb?.branche && (
                <p className="text-sm text-destructive mt-1">{errors.unfallbetrieb.branche.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* UV-TRÄGER */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 py-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground">
            UV-Träger
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Berufsgenossenschaft / Unfallkasse
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

            {/* UV-Träger Suche */}
            <div className="col-span-full">
              <Label>UV-Träger suchen oder neu anlegen</Label>
              <div className="flex gap-3 mt-2">
                <Popover open={uvOpen} onOpenChange={setUvOpen}>
                  <PopoverTrigger render={<Button variant="outline" className="w-80 justify-between" />}>

                    {selectedUvTraegerId && uvName ? (
                      <span>{uvName}</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-2">
                        UV-Träger suchen...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />

                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Name oder Kürzel..."
                        value={uvSearch}
                        onChange={(e) => { setUvSearch(e.target.value) }}
                      />
                      <CommandList>
                        {
                          !uvSearching && uvOptions.length === 0 &&
                          <CommandEmpty>Keine UV-Träger gefunden.</CommandEmpty>
                        }
                        {uvSearching ? (
                          <div className="flex items-center justify-center py-6 text-muted-foreground">
                            <Spinner />
                          </div>
                        ) : (
                          <>
                            <CommandGroup>
                              {uvOptions.map((uv) => (
                                <CommandItem key={uv.id} onClick={() => handleUVSelect(uv)}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUvTraegerId === uv.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{uv.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {uv.kuerzel}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button type="button" variant={isNewUV ? "default" : "outline"} onClick={handleNewUV}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="uv_name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="uv_name"
                placeholder="Berufsgenossenschaft BAU"
                className="mt-2"
                {...register("uv_traeger.name")}
              />
              {errors.uv_traeger?.name && (
                <p className="text-sm text-destructive mt-1">{errors.uv_traeger.name.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="uv_kuerzel">
                Kürzel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="uv_kuerzel"
                placeholder="BG BAU"
                className="mt-2"
                {...register("uv_traeger.kuerzel")}
              />
              {errors.uv_traeger?.kuerzel && (
                <p className="text-sm text-destructive mt-1">{errors.uv_traeger.kuerzel.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="uv_telefon">
                Telefonnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="uv_telefon"
                className="mt-2"
                {...register("uv_traeger.telefon")}
              />
              {errors.uv_traeger?.telefon && (
                <p className="text-sm text-destructive mt-1">{errors.uv_traeger.telefon.message}</p>
              )}
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="uv_email">E-Mail</Label>
              <Input
                id="uv_email"
                type="email"
                className="mt-2"
                {...register("uv_traeger.email")}
              />
              {errors.uv_traeger?.email && (
                <p className="text-sm text-destructive mt-1">{errors.uv_traeger.email.message}</p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="uv_adresse">
                Anschrift <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="uv_adresse"
                className="mt-2 min-h-[80px]"
                {...register("uv_traeger.adresse")}
              />
              {errors.uv_traeger?.adresse && (
                <p className="text-sm text-destructive mt-1">{errors.uv_traeger.adresse.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
