// Step1Form.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { ReportFormValues } from "./schemas"
import { Section, Label, Input, Select, DebugPanel } from "./FormUI";

export function Step1Form({ onNext }: { onNext: () => void }) {
    const {
        register,
        formState: { errors },
    } = useFormContext<ReportFormValues>();

    return (
        <form className="space-y-6">
            {/* Bericht */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* ===================== */}
                {/* DURCHGANGSARZTBERICHT */}
                {/* ===================== */}
                <Section
                    title="Durchgangsarztbericht"
                    subtitle="Grunddaten des Berichts für den UV-Träger"
                >
                    <div className="max-w-md">
                        <Label>Lfd. Nr.</Label>
                        <Input
                            placeholder="202X-..."
                            {...register("bericht.lfd_nr")}
                            error={errors.bericht?.lfd_nr?.message}
                        />
                    </div>
                </Section>

                {/* ===================== */}
                {/* PATIENTENINFORMATIONEN */}
                {/* ===================== */}
                <Section
                    title="Patienteninformationen"
                    subtitle="Persönliche Angaben zur versicherten Person"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label required>Vorname</Label>
                            <Input
                                placeholder="Max"
                                {...register("patient.vorname")}
                                error={errors.patient?.vorname?.message}
                            />
                        </div>

                        <div>
                            <Label required>Nachname</Label>
                            <Input
                                placeholder="Mustermann"
                                {...register("patient.nachname")}
                                error={errors.patient?.nachname?.message}
                            />
                        </div>

                        <div>
                            <Label required>Geburtsdatum</Label>
                            <Input
                                type="date"
                                {...register("patient.geburtsdatum")}
                                error={errors.patient?.geburtsdatum?.message}
                            />
                        </div>

                        <div>
                            <Label required>Geschlecht</Label>
                            <Select
                                {...register("patient.geschlecht")}
                                error={errors.patient?.geschlecht?.message}
                                options={[
                                    { value: "", label: "Bitte wählen" },
                                    { value: "m", label: "Männlich" },
                                    { value: "w", label: "Weiblich" },
                                    { value: "d", label: "Divers" },
                                ]}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label required>Telefon</Label>
                            <Input
                                type="tel"
                                placeholder="+49 123 4567890"
                                {...register("patient.telefon")}
                                error={errors.patient?.telefon?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label required>Staatsangehörigkeit</Label>
                            <Input
                                placeholder="Deutsch"
                                {...register("patient.staatsangehoerigkeit")}
                                error={errors.patient?.staatsangehoerigkeit?.message}
                            />
                        </div>
                    </div>
                </Section>

                {/* ===================== */}
                {/* ANSCHRIFT */}
                {/* ===================== */}
                <Section
                    title="Anschrift"
                    subtitle="Aktuelle Meldeadresse"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                        <div className="sm:col-span-6">
                            <Label required>Straße</Label>
                            <Input
                                placeholder="Musterstraße 1"
                                {...register("patient.strasse")}
                                error={errors.patient?.strasse?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label required>PLZ</Label>
                            <Input
                                placeholder="12345"
                                {...register("patient.plz")}
                                error={errors.patient?.plz?.message}
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <Label required>Ort</Label>
                            <Input
                                placeholder="Musterstadt"
                                {...register("patient.ort")}
                                error={errors.patient?.ort?.message}
                            />
                        </div>
                    </div>
                </Section>

                {/* ===================== */}
                {/* BESCHÄFTIGUNG */}
                {/* ===================== */}
                <Section
                    title="Beschäftigung"
                    subtitle="Angaben zur beruflichen Tätigkeit"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                        <div>
                            <Label required>Beschäftigt als</Label>
                            <Input
                                {...register("patient.beschaeftigt_als")}
                                error={errors.patient?.beschaeftigt_als?.message}
                            />
                        </div>

                        <div>
                            <Label required>Seit</Label>
                            <Input
                                type="date"
                                {...register("patient.beschaeftigt_seit")}
                                error={errors.patient?.beschaeftigt_seit?.message}
                            />
                        </div>
                    </div>
                </Section>

            </div>

            <button type="button" onClick={onNext}>
                Weiter
            </button>
        </form>
    );
}
