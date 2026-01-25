// app/formular/steps/Step1Patient.tsx
'use client';

import { useState } from 'react';
import { Section, Label, Input, Select } from '../components/FormUI';
import { FormularData } from '@/types/formular';

interface Props {
    data: FormularData;
    onChange: (data: Partial<FormularData>) => void;
    onNext: (data: Partial<FormularData>) => void;
}

export function Step1Patient({ data, onChange, onNext }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updatePatient = (field: string, value: string | boolean) => {
        onChange({
            patient: { ...data.patient, [field]: value }
        });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Pflichtfelder
        if (!data.patient.vorname?.trim()) newErrors['patient.vorname'] = 'Pflichtfeld';
        if (!data.patient.nachname?.trim()) newErrors['patient.nachname'] = 'Pflichtfeld';
        if (!data.patient.geburtsdatum) newErrors['patient.geburtsdatum'] = 'Pflichtfeld';
        if (!data.patient.geschlecht) newErrors['patient.geschlecht'] = 'Pflichtfeld';
        if (!data.lfd_nr?.trim()) newErrors['lfd_nr'] = 'Pflichtfeld';

        // PLZ Validierung (max 10 Zeichen, idealerweise 5 Ziffern für DE)
        if (data.patient.plz && data.patient.plz.length > 10) {
            newErrors['patient.plz'] = 'PLZ darf max. 10 Zeichen haben';
        }

        // Telefon max 50 Zeichen
        if (data.patient.telefon && data.patient.telefon.length > 50) {
            newErrors['patient.telefon'] = 'Telefon darf max. 50 Zeichen haben';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext({ patient: data.patient, lfd_nr: data.lfd_nr });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Bericht Grunddaten */}
            <Section title="Durchgangsarztbericht" subtitle="Grunddaten des Berichts">
                <div className="max-w-md">
                    <Label required>Lfd. Nr.</Label>
                    <Input
                        placeholder="2025-001"
                        value={data.lfd_nr}
                        onChange={(e) => onChange({ lfd_nr: e.target.value })}
                        error={errors['lfd_nr']}
                    />
                </div>
            </Section>

            {/* Patient */}
            <Section title="Patienteninformationen" subtitle="Persönliche Angaben">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label required>Vorname</Label>
                        <Input
                            placeholder="Max"
                            value={data.patient.vorname}
                            onChange={(e) => updatePatient('vorname', e.target.value)}
                            error={errors['patient.vorname']}
                        />
                    </div>

                    <div>
                        <Label required>Nachname</Label>
                        <Input
                            placeholder="Mustermann"
                            value={data.patient.nachname}
                            onChange={(e) => updatePatient('nachname', e.target.value)}
                            error={errors['patient.nachname']}
                        />
                    </div>

                    <div>
                        <Label required>Geburtsdatum</Label>
                        <Input
                            type="date"
                            value={data.patient.geburtsdatum}
                            onChange={(e) => updatePatient('geburtsdatum', e.target.value)}
                            error={errors['patient.geburtsdatum']}
                        />
                    </div>

                    <div>
                        <Label required>Geschlecht</Label>
                        <Select
                            value={data.patient.geschlecht}
                            onChange={(e) => updatePatient('geschlecht', e.target.value)}
                            error={errors['patient.geschlecht']}
                            options={[
                                { value: '', label: 'Bitte wählen' },
                                { value: 'm', label: 'Männlich' },
                                { value: 'w', label: 'Weiblich' },
                                { value: 'd', label: 'Divers' },
                            ]}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Label>Telefon</Label>
                        <Input
                            type="tel"
                            placeholder="+49 123 4567890"
                            maxLength={50}
                            value={data.patient.telefon}
                            onChange={(e) => updatePatient('telefon', e.target.value)}
                            error={errors['patient.telefon']}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Label>Staatsangehörigkeit</Label>
                        <Input
                            placeholder="Deutsch"
                            maxLength={100}
                            value={data.patient.staatsangehoerigkeit}
                            onChange={(e) => updatePatient('staatsangehoerigkeit', e.target.value)}
                        />
                    </div>
                </div>
            </Section>

            {/* Anschrift */}
            <Section title="Anschrift" subtitle="Aktuelle Meldeadresse">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                    <div className="sm:col-span-6">
                        <Label>Straße</Label>
                        <Input
                            placeholder="Musterstraße 1"
                            maxLength={255}
                            value={data.patient.strasse}
                            onChange={(e) => updatePatient('strasse', e.target.value)}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Label>PLZ</Label>
                        <Input
                            placeholder="12345"
                            maxLength={10}
                            value={data.patient.plz}
                            onChange={(e) => updatePatient('plz', e.target.value)}
                            error={errors['patient.plz']}
                        />
                        <p className="text-xs text-slate-400 mt-1">Max. 10 Zeichen</p>
                    </div>

                    <div className="sm:col-span-4">
                        <Label>Ort</Label>
                        <Input
                            placeholder="Musterstadt"
                            maxLength={100}
                            value={data.patient.ort}
                            onChange={(e) => updatePatient('ort', e.target.value)}
                        />
                    </div>
                </div>
            </Section>

            {/* Beschäftigung */}
            <Section title="Beschäftigung" subtitle="Berufliche Tätigkeit">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label>Beschäftigt als</Label>
                        <Input
                            placeholder="z.B. Bauarbeiter"
                            value={data.patient.beschaeftigt_als}
                            onChange={(e) => updatePatient('beschaeftigt_als', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Seit</Label>
                        <Input
                            type="date"
                            value={data.patient.beschaeftigt_seit}
                            onChange={(e) => updatePatient('beschaeftigt_seit', e.target.value)}
                        />
                        <p className="text-xs text-slate-400 mt-1">Wird lokal gespeichert (nicht im Backend)</p>
                    </div>
                </div>
            </Section>

            {/* Navigation */}
            <div className="flex justify-end pt-8 border-t border-slate-100">
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    Weiter zu Unfalldaten →
                </button>
            </div>
        </div>
    );
}