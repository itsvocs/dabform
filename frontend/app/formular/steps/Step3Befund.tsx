// app/formular/steps/Step3Befund.tsx
'use client';

import { useState } from 'react';
import { Section, Label, Input, Textarea, Checkbox } from '../components/FormUI';
import { FormularData } from '@/types/formular';

interface Props {
    data: FormularData;
    onChange: (data: Partial<FormularData>) => void;
    onNext: (data: Partial<FormularData>) => void;
    onBack: () => void;
}

export function Step3Befund({ data, onChange, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: keyof FormularData, value: string | boolean) => {
        onChange({ [field]: value });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data.beschwerden_klagen?.trim()) newErrors['beschwerden_klagen'] = 'Pflichtfeld';
        if (!data.klinische_befunde?.trim()) newErrors['klinische_befunde'] = 'Pflichtfeld';
        if (!data.bildgebende_diagnostik?.trim()) newErrors['bildgebende_diagnostik'] = 'Pflichtfeld';
        if (!data.erstdiagnose_freitext?.trim()) newErrors['erstdiagnose_freitext'] = 'Pflichtfeld';
        if (!data.erstdiagnose_icd10?.trim()) newErrors['erstdiagnose_icd10'] = 'Pflichtfeld';

        // Bedingte Validierung
        if (data.verdacht_alkohol_drogen === true && !data.alkohol_drogen_anzeichen?.trim()) {
            newErrors['alkohol_drogen_anzeichen'] = 'Bitte Anzeichen angeben';
        }
        if (data.handverletzung === true && !data.gebrauchshand) {
            newErrors['gebrauchshand'] = 'Bitte Gebrauchshand angeben';
        }
        if (data.polytrauma === true && !data.iss_score?.trim()) {
            newErrors['iss_score'] = 'Bitte ISS-Score angeben';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext({
                verdacht_alkohol_drogen: data.verdacht_alkohol_drogen,
                alkohol_drogen_anzeichen: data.alkohol_drogen_anzeichen,
                blutentnahme_durchgefuehrt: data.blutentnahme_durchgefuehrt,
                beschwerden_klagen: data.beschwerden_klagen,
                klinische_befunde: data.klinische_befunde,
                bildgebende_diagnostik: data.bildgebende_diagnostik,
                erstdiagnose_freitext: data.erstdiagnose_freitext,
                handverletzung: data.handverletzung,
                gebrauchshand: data.gebrauchshand,
                polytrauma: data.polytrauma,
                iss_score: data.iss_score,
                erstdiagnose_icd10: data.erstdiagnose_icd10,
                erstdiagnose_ao: data.erstdiagnose_ao,
            });
        }
    };

    // Helper für disabled Styling
    const getDisabledClass = (isActive: boolean) =>
        `transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Alkohol / Drogen */}
            <Section title="Alkohol / Drogen" subtitle="Verdacht auf Beeinflussung">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <div>
                        <Label>Besteht Verdacht auf Alkohol- oder Drogeneinfluss?</Label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="verdacht_alkohol"
                                    checked={data.verdacht_alkohol_drogen === true}
                                    onChange={() => updateField('verdacht_alkohol_drogen', true)}
                                    className="w-4 h-4 accent-slate-900"
                                />
                                <span className="text-sm">Ja</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="verdacht_alkohol"
                                    checked={data.verdacht_alkohol_drogen === false}
                                    onChange={() => {
                                        updateField('verdacht_alkohol_drogen', false);
                                        updateField('alkohol_drogen_anzeichen', '');
                                    }}
                                    className="w-4 h-4 accent-slate-900"
                                />
                                <span className="text-sm">Nein</span>
                            </label>
                        </div>
                    </div>

                    <div className={getDisabledClass(data.verdacht_alkohol_drogen === true)}>
                        <Label required={data.verdacht_alkohol_drogen === true}>Welche Anzeichen?</Label>
                        <Input
                            placeholder="z.B. Alkoholgeruch, verwaschene Sprache, unsicherer Gang"
                            value={data.alkohol_drogen_anzeichen}
                            onChange={(e) => updateField('alkohol_drogen_anzeichen', e.target.value)}
                            error={errors['alkohol_drogen_anzeichen']}
                            disabled={data.verdacht_alkohol_drogen !== true}
                        />
                    </div>

                    <Checkbox
                        label="Blutentnahme durchgeführt"
                        checked={data.blutentnahme_durchgefuehrt || false}
                        onChange={(e) => updateField('blutentnahme_durchgefuehrt', e.target.checked)}
                    />
                </div>
            </Section>

            {/* Befund */}
            <Section title="Klinischer Befund" subtitle="Medizinische Feststellungen">
                <div className="space-y-6">
                    <div>
                        <Label required>Beschwerden / Klagen des Patienten</Label>
                        <Textarea
                            placeholder="Subjektive Beschwerden des Patienten..."
                            value={data.beschwerden_klagen}
                            onChange={(e) => updateField('beschwerden_klagen', e.target.value)}
                            error={errors['beschwerden_klagen']}
                        />
                    </div>

                    <div>
                        <Label required>Klinische Befunde</Label>
                        <Textarea
                            placeholder="Objektive Untersuchungsbefunde..."
                            value={data.klinische_befunde}
                            onChange={(e) => updateField('klinische_befunde', e.target.value)}
                            error={errors['klinische_befunde']}
                        />
                    </div>

                    <div>
                        <Label required>Bildgebende Diagnostik</Label>
                        <Textarea
                            placeholder="z.B. Röntgen linkes Handgelenk: Keine Fraktur erkennbar"
                            value={data.bildgebende_diagnostik}
                            onChange={(e) => updateField('bildgebende_diagnostik', e.target.value)}
                            error={errors['bildgebende_diagnostik']}
                        />
                    </div>
                </div>
            </Section>

            {/* Spezielle Verletzungen */}
            <Section title="Spezielle Verletzungen" subtitle="Handverletzungen und Polytrauma">
                <div className="space-y-6">

                    {/* Handverletzung */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                        <div>
                            <Label>Liegt eine Handverletzung vor?</Label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="handverletzung"
                                        checked={data.handverletzung === true}
                                        onChange={() => updateField('handverletzung', true)}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Ja</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="handverletzung"
                                        checked={data.handverletzung === false}
                                        onChange={() => {
                                            updateField('handverletzung', false);
                                            updateField('gebrauchshand', '');
                                        }}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Nein</span>
                                </label>
                            </div>
                        </div>

                        <div className={getDisabledClass(data.handverletzung === true)}>
                            <Label required={data.handverletzung === true}>Gebrauchshand</Label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gebrauchshand"
                                        checked={data.gebrauchshand === 'links'}
                                        onChange={() => updateField('gebrauchshand', 'links')}
                                        disabled={data.handverletzung !== true}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Links</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gebrauchshand"
                                        checked={data.gebrauchshand === 'rechts'}
                                        onChange={() => updateField('gebrauchshand', 'rechts')}
                                        disabled={data.handverletzung !== true}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Rechts</span>
                                </label>
                            </div>
                            {errors['gebrauchshand'] && (
                                <p className="mt-1 text-[11px] font-medium text-red-600">{errors['gebrauchshand']}</p>
                            )}
                        </div>
                    </div>

                    {/* Polytrauma */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                        <div>
                            <Label>Liegt ein Polytrauma vor?</Label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="polytrauma"
                                        checked={data.polytrauma === true}
                                        onChange={() => updateField('polytrauma', true)}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Ja</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="polytrauma"
                                        checked={data.polytrauma === false}
                                        onChange={() => {
                                            updateField('polytrauma', false);
                                            updateField('iss_score', '');
                                        }}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Nein</span>
                                </label>
                            </div>
                        </div>

                        <div className={getDisabledClass(data.polytrauma === true)}>
                            <Label required={data.polytrauma === true}>ISS-Score</Label>
                            <Input
                                type="number"
                                placeholder="z.B. 16"
                                value={data.iss_score}
                                onChange={(e) => updateField('iss_score', e.target.value)}
                                error={errors['iss_score']}
                                disabled={data.polytrauma !== true}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Diagnose */}
            <Section title="Diagnose" subtitle="Erstdiagnose und Klassifikation">
                <div className="space-y-6">
                    <div>
                        <Label required>Erstdiagnose (Freitext)</Label>
                        <Textarea
                            placeholder="Vollständige Diagnose in Textform..."
                            className="min-h-[100px]"
                            value={data.erstdiagnose_freitext}
                            onChange={(e) => updateField('erstdiagnose_freitext', e.target.value)}
                            error={errors['erstdiagnose_freitext']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label required>ICD-10 Code</Label>
                            <Input
                                placeholder="z.B. S62.6"
                                value={data.erstdiagnose_icd10}
                                onChange={(e) => updateField('erstdiagnose_icd10', e.target.value)}
                                error={errors['erstdiagnose_icd10']}
                            />
                        </div>
                        <div>
                            <Label>AO-Klassifikation</Label>
                            <Input
                                placeholder="z.B. 2R3A"
                                value={data.erstdiagnose_ao}
                                onChange={(e) => updateField('erstdiagnose_ao', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-slate-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                    ← Zurück
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    Weiter zu Behandlung →
                </button>
            </div>
        </div>
    );
}