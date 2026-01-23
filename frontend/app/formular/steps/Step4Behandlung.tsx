// app/formular/steps/Step4Behandlung.tsx
'use client';

import { useState } from 'react';
import { Section, Label, Input, Textarea, Select, Checkbox } from '../components/FormUI';
import { FormularData } from '@/types/formular';

interface Props {
    data: FormularData;
    onChange: (data: Partial<FormularData>) => void;
    onNext: (data: Partial<FormularData>) => void;
    onBack: () => void;
}

export function Step4Behandlung({ data, onChange, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: keyof FormularData, value: string | boolean | null) => {
        onChange({ [field]: value });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data.art_da_versorgung?.trim()) newErrors['art_da_versorgung'] = 'Pflichtfeld';
        if (!data.vorerkrankungen?.trim()) newErrors['vorerkrankungen'] = 'Pflichtfeld (ggf. "Keine")';
        if (!data.heilbehandlung_art) newErrors['heilbehandlung_art'] = 'Pflichtfeld';
        if (!data.weiterbehandlung_durch) newErrors['weiterbehandlung_durch'] = 'Pflichtfeld';
        if (!data.wiedervorstellung_datum) newErrors['wiedervorstellung_datum'] = 'Pflichtfeld';

        // Bedingte Validierung
        if (data.zweifel_arbeitsunfall === true && !data.zweifel_begruendung?.trim()) {
            newErrors['zweifel_begruendung'] = 'Bitte Zweifel begründen';
        }
        if (data.heilbehandlung_art === 'keine' && !data.keine_heilbehandlung_grund?.trim()) {
            newErrors['keine_heilbehandlung_grund'] = 'Bitte Grund angeben';
        }
        if (data.verletzung_vav === true && !data.verletzung_vav_ziffer?.trim()) {
            newErrors['verletzung_vav_ziffer'] = 'VAV-Ziffer erforderlich';
        }
        if (data.verletzung_sav === true && !data.verletzung_sav_ziffer?.trim()) {
            newErrors['verletzung_sav_ziffer'] = 'SAV-Ziffer erforderlich';
        }
        if (data.weiterbehandlung_durch === 'anderer_arzt') {
            if (!data.anderer_arzt_name?.trim()) newErrors['anderer_arzt_name'] = 'Name erforderlich';
            if (!data.anderer_arzt_adresse?.trim()) newErrors['anderer_arzt_adresse'] = 'Adresse erforderlich';
        }
        if (data.arbeitsfaehig === false) {
            if (!data.arbeitsunfaehig_ab) newErrors['arbeitsunfaehig_ab'] = 'Pflichtfeld';
            if (!data.arbeitsfaehig_ab) newErrors['arbeitsfaehig_ab'] = 'Pflichtfeld';
        }
        if (data.weitere_aerzte_noetig === true && !data.weitere_aerzte_namen?.trim()) {
            newErrors['weitere_aerzte_namen'] = 'Bitte Namen angeben';
        }
        if (data.wiedervorstellung_mitgeteilt !== true) {
            newErrors['wiedervorstellung_mitgeteilt'] = 'Muss bestätigt werden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext({
                art_da_versorgung: data.art_da_versorgung,
                vorerkrankungen: data.vorerkrankungen,
                zweifel_arbeitsunfall: data.zweifel_arbeitsunfall,
                zweifel_begruendung: data.zweifel_begruendung,
                heilbehandlung_art: data.heilbehandlung_art,
                keine_heilbehandlung_grund: data.keine_heilbehandlung_grund,
                verletzung_vav: data.verletzung_vav,
                verletzung_vav_ziffer: data.verletzung_vav_ziffer,
                verletzung_sav: data.verletzung_sav,
                verletzung_sav_ziffer: data.verletzung_sav_ziffer,
                weiterbehandlung_durch: data.weiterbehandlung_durch,
                anderer_arzt_name: data.anderer_arzt_name,
                anderer_arzt_adresse: data.anderer_arzt_adresse,
                arbeitsfaehig: data.arbeitsfaehig,
                arbeitsunfaehig_ab: data.arbeitsunfaehig_ab,
                arbeitsfaehig_ab: data.arbeitsfaehig_ab,
                au_laenger_3_monate: data.au_laenger_3_monate,
                weitere_aerzte_noetig: data.weitere_aerzte_noetig,
                weitere_aerzte_namen: data.weitere_aerzte_namen,
                wiedervorstellung_datum: data.wiedervorstellung_datum,
                wiedervorstellung_mitgeteilt: data.wiedervorstellung_mitgeteilt,
            });
        }
    };

    const getDisabledClass = (isActive: boolean) =>
        `transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Ärztliche Beurteilung */}
            <Section title="Ärztliche Beurteilung" subtitle="Versorgung und Vorerkrankungen">
                <div className="space-y-6">
                    <div>
                        <Label required>Art der D-ärztlichen Versorgung</Label>
                        <Textarea
                            placeholder="z.B. Operativ / Konservativ, durchgeführte Maßnahmen..."
                            value={data.art_da_versorgung}
                            onChange={(e) => updateField('art_da_versorgung', e.target.value)}
                            error={errors['art_da_versorgung']}
                        />
                    </div>

                    <div>
                        <Label required>Vorerkrankungen / Vorschäden</Label>
                        <Textarea
                            placeholder="Relevante Vorerkrankungen oder 'Keine bekannt'"
                            value={data.vorerkrankungen}
                            onChange={(e) => updateField('vorerkrankungen', e.target.value)}
                            error={errors['vorerkrankungen']}
                        />
                    </div>

                    {/* Zweifel Box - MIT RADIO BUTTONS */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-4">
                        <div>
                            <Label>Bestehen Zweifel am Arbeitsunfall?</Label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="zweifel_arbeitsunfall"
                                        checked={data.zweifel_arbeitsunfall === true}
                                        onChange={() => updateField('zweifel_arbeitsunfall', true)}
                                        className="w-4 h-4 accent-orange-600"
                                    />
                                    <span className="text-sm font-medium text-orange-900">Ja, Zweifel</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="zweifel_arbeitsunfall"
                                        checked={data.zweifel_arbeitsunfall === false}
                                        onChange={() => {
                                            updateField('zweifel_arbeitsunfall', false);
                                            updateField('zweifel_begruendung', '');
                                        }}
                                        className="w-4 h-4 accent-slate-900"
                                    />
                                    <span className="text-sm">Nein</span>
                                </label>
                            </div>
                        </div>

                        <div className={getDisabledClass(data.zweifel_arbeitsunfall === true)}>
                            <Label required={data.zweifel_arbeitsunfall === true}>Begründung der Zweifel</Label>
                            <Textarea
                                placeholder="Warum bestehen Zweifel..."
                                value={data.zweifel_begruendung}
                                onChange={(e) => updateField('zweifel_begruendung', e.target.value)}
                                error={errors['zweifel_begruendung']}
                                disabled={data.zweifel_arbeitsunfall !== true}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Heilbehandlung */}
            <Section title="Heilbehandlung" subtitle="Weiteres Vorgehen und Verfahrensart">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label required>Art der Heilbehandlung</Label>
                            <Select
                                value={data.heilbehandlung_art}
                                onChange={(e) => updateField('heilbehandlung_art', e.target.value)}
                                error={errors['heilbehandlung_art']}
                                options={[
                                    { value: '', label: 'Bitte wählen' },
                                    { value: 'ambulant', label: 'Allgemeine Heilbehandlung (ambulant)' },
                                    { value: 'stationaer', label: 'Besondere Heilbehandlung (stationär)' },
                                    { value: 'keine', label: 'Keine weitere Behandlung' },
                                ]}
                            />
                        </div>

                        <div className={getDisabledClass(data.heilbehandlung_art === 'keine')}>
                            <Label required={data.heilbehandlung_art === 'keine'}>Begründung (keine Behandlung)</Label>
                            <Input
                                placeholder="Warum keine weitere Behandlung?"
                                value={data.keine_heilbehandlung_grund}
                                onChange={(e) => updateField('keine_heilbehandlung_grund', e.target.value)}
                                error={errors['keine_heilbehandlung_grund']}
                                disabled={data.heilbehandlung_art !== 'keine'}
                            />
                        </div>
                    </div>

                    {/* VAV / SAV - MIT CHECKBOXEN (hier ist Checkbox korrekt!) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                            <Checkbox
                                label="Verletzungsartenverfahren (VAV)"
                                checked={data.verletzung_vav || false}
                                onChange={(e) => {
                                    updateField('verletzung_vav', e.target.checked);
                                    if (!e.target.checked) updateField('verletzung_vav_ziffer', '');
                                }}
                            />
                            <div className={getDisabledClass(data.verletzung_vav === true)}>
                                <Input
                                    placeholder="VAV-Ziffer"
                                    value={data.verletzung_vav_ziffer}
                                    onChange={(e) => updateField('verletzung_vav_ziffer', e.target.value)}
                                    error={errors['verletzung_vav_ziffer']}
                                    disabled={data.verletzung_vav !== true}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                            <Checkbox
                                label="Schwerstverletzungsartenverfahren (SAV)"
                                checked={data.verletzung_sav || false}
                                onChange={(e) => {
                                    updateField('verletzung_sav', e.target.checked);
                                    if (!e.target.checked) updateField('verletzung_sav_ziffer', '');
                                }}
                            />
                            <div className={getDisabledClass(data.verletzung_sav === true)}>
                                <Input
                                    placeholder="SAV-Ziffer"
                                    value={data.verletzung_sav_ziffer}
                                    onChange={(e) => updateField('verletzung_sav_ziffer', e.target.value)}
                                    error={errors['verletzung_sav_ziffer']}
                                    disabled={data.verletzung_sav !== true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Weiterbehandlung */}
            <Section title="Weiterbehandlung" subtitle="Wer führt die Behandlung fort?">
                <div className="space-y-6">
                    <div>
                        <Label required>Weiterbehandlung durch</Label>
                        <Select
                            value={data.weiterbehandlung_durch}
                            onChange={(e) => {
                                updateField('weiterbehandlung_durch', e.target.value);
                                if (e.target.value !== 'anderer_arzt') {
                                    updateField('anderer_arzt_name', '');
                                    updateField('anderer_arzt_adresse', '');
                                }
                            }}
                            error={errors['weiterbehandlung_durch']}
                            options={[
                                { value: '', label: 'Bitte wählen' },
                                { value: 'selbst', label: 'D-Arzt selbst' },
                                { value: 'anderer_arzt', label: 'Anderen Arzt' },
                            ]}
                        />
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${getDisabledClass(data.weiterbehandlung_durch === 'anderer_arzt')}`}>
                        <div>
                            <Label required={data.weiterbehandlung_durch === 'anderer_arzt'}>Name des Arztes</Label>
                            <Input
                                placeholder="Dr. med. ..."
                                value={data.anderer_arzt_name}
                                onChange={(e) => updateField('anderer_arzt_name', e.target.value)}
                                error={errors['anderer_arzt_name']}
                                disabled={data.weiterbehandlung_durch !== 'anderer_arzt'}
                            />
                        </div>
                        <div>
                            <Label required={data.weiterbehandlung_durch === 'anderer_arzt'}>Adresse</Label>
                            <Input
                                placeholder="Straße, PLZ Ort"
                                value={data.anderer_arzt_adresse}
                                onChange={(e) => updateField('anderer_arzt_adresse', e.target.value)}
                                error={errors['anderer_arzt_adresse']}
                                disabled={data.weiterbehandlung_durch !== 'anderer_arzt'}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Arbeitsfähigkeit - MIT RADIO BUTTONS */}
            <Section title="Arbeitsfähigkeit" subtitle="Einschätzung der Arbeitsfähigkeit">
                <div className="space-y-6">
                    <div>
                        <Label>Ist der Patient arbeitsfähig?</Label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="arbeitsfaehig"
                                    checked={data.arbeitsfaehig === true}
                                    onChange={() => {
                                        updateField('arbeitsfaehig', true);
                                        updateField('arbeitsunfaehig_ab', '');
                                        updateField('arbeitsfaehig_ab', '');
                                        updateField('au_laenger_3_monate', false);
                                    }}
                                    className="w-4 h-4 accent-green-600"
                                />
                                <span className="text-sm text-green-700 font-medium">Ja, arbeitsfähig</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="arbeitsfaehig"
                                    checked={data.arbeitsfaehig === false}
                                    onChange={() => updateField('arbeitsfaehig', false)}
                                    className="w-4 h-4 accent-red-600"
                                />
                                <span className="text-sm text-red-700 font-medium">Nein, arbeitsunfähig</span>
                            </label>
                        </div>
                    </div>

                    <div className={`bg-red-50 p-4 rounded-lg border border-red-200 space-y-4 ${getDisabledClass(data.arbeitsfaehig === false)}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label required={data.arbeitsfaehig === false}>Arbeitsunfähig ab</Label>
                                <Input
                                    type="date"
                                    value={data.arbeitsunfaehig_ab}
                                    onChange={(e) => updateField('arbeitsunfaehig_ab', e.target.value)}
                                    error={errors['arbeitsunfaehig_ab']}
                                    disabled={data.arbeitsfaehig !== false}
                                />
                            </div>
                            <div>
                                <Label required={data.arbeitsfaehig === false}>Voraussichtlich arbeitsfähig ab</Label>
                                <Input
                                    type="date"
                                    value={data.arbeitsfaehig_ab}
                                    onChange={(e) => updateField('arbeitsfaehig_ab', e.target.value)}
                                    error={errors['arbeitsfaehig_ab']}
                                    disabled={data.arbeitsfaehig !== false}
                                />
                            </div>
                        </div>

                        <Checkbox
                            label="Arbeitsunfähigkeit voraussichtlich länger als 3 Monate"
                            checked={data.au_laenger_3_monate || false}
                            onChange={(e) => updateField('au_laenger_3_monate', e.target.checked)}
                            disabled={data.arbeitsfaehig !== false}
                        />
                    </div>
                </div>
            </Section>

            {/* Weitere Ärzte - MIT RADIO BUTTONS */}
            <Section title="Weitere Ärzte" subtitle="Hinzuziehung anderer Fachärzte">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <div>
                        <Label>Sind weitere Ärzte hinzuzuziehen?</Label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="weitere_aerzte"
                                    checked={data.weitere_aerzte_noetig === true}
                                    onChange={() => updateField('weitere_aerzte_noetig', true)}
                                    className="w-4 h-4 accent-slate-900"
                                />
                                <span className="text-sm">Ja</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="weitere_aerzte"
                                    checked={data.weitere_aerzte_noetig === false}
                                    onChange={() => {
                                        updateField('weitere_aerzte_noetig', false);
                                        updateField('weitere_aerzte_namen', '');
                                    }}
                                    className="w-4 h-4 accent-slate-900"
                                />
                                <span className="text-sm">Nein</span>
                            </label>
                        </div>
                    </div>

                    <div className={getDisabledClass(data.weitere_aerzte_noetig === true)}>
                        <Label required={data.weitere_aerzte_noetig === true}>Name / Fachgebiet</Label>
                        <Textarea
                            placeholder="z.B. Neurologisches Konsil erforderlich, Dr. Müller..."
                            value={data.weitere_aerzte_namen}
                            onChange={(e) => updateField('weitere_aerzte_namen', e.target.value)}
                            error={errors['weitere_aerzte_namen']}
                            disabled={data.weitere_aerzte_noetig !== true}
                        />
                    </div>
                </div>
            </Section>

            {/* Wiedervorstellung */}
            <Section title="Wiedervorstellung" subtitle="Nächster Kontrolltermin">
                <div className="space-y-4">
                    <div className="max-w-md">
                        <Label required>Wiedervorstellungstermin</Label>
                        <Input
                            type="date"
                            value={data.wiedervorstellung_datum}
                            onChange={(e) => updateField('wiedervorstellung_datum', e.target.value)}
                            error={errors['wiedervorstellung_datum']}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <Checkbox
                            label="Termin wurde dem Patienten mitgeteilt"
                            checked={data.wiedervorstellung_mitgeteilt || false}
                            onChange={(e) => updateField('wiedervorstellung_mitgeteilt', e.target.checked)}
                        />
                        {errors['wiedervorstellung_mitgeteilt'] && (
                            <p className="mt-2 text-[11px] font-medium text-red-600">{errors['wiedervorstellung_mitgeteilt']}</p>
                        )}
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
                    Weiter zu Abschluss →
                </button>
            </div>
        </div>
    );
}