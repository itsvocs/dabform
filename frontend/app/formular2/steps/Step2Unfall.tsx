// app/formular/steps/Step2Unfall.tsx
'use client';

import { useState } from 'react';
import { Section, Label, Input, Textarea } from '../components/FormUI';
import { FormularData } from '@/types/formular';

interface Props {
    data: FormularData;
    onChange: (data: Partial<FormularData>) => void;
    onNext: (data: Partial<FormularData>) => void;
    onBack: () => void;
}

export function Step2Unfall({ data, onChange, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: keyof FormularData, value: string) => {
        onChange({ [field]: value });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data.unfalltag) newErrors['unfalltag'] = 'Pflichtfeld';
        if (!data.unfallzeit) newErrors['unfallzeit'] = 'Pflichtfeld';
        if (!data.unfallort) newErrors['unfallort'] = 'Pflichtfeld';
        if (!data.unfallhergang) newErrors['unfallhergang'] = 'Pflichtfeld';
        if (!data.verhalten_nach_unfall) newErrors['verhalten_nach_unfall'] = 'Pflichtfeld';
        if (!data.art_erstversorgung) newErrors['art_erstversorgung'] = 'Pflichtfeld';
        if (!data.erstbehandlung_datum) newErrors['erstbehandlung_datum'] = 'Pflichtfeld';
        if (!data.erstbehandlung_durch) newErrors['erstbehandlung_durch'] = 'Pflichtfeld';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext({
                unfalltag: data.unfalltag,
                unfallzeit: data.unfallzeit,
                unfallort: data.unfallort,
                arbeitszeit_beginn: data.arbeitszeit_beginn,
                arbeitszeit_ende: data.arbeitszeit_ende,
                unfallhergang: data.unfallhergang,
                verhalten_nach_unfall: data.verhalten_nach_unfall,
                art_erstversorgung: data.art_erstversorgung,
                erstbehandlung_datum: data.erstbehandlung_datum,
                erstbehandlung_durch: data.erstbehandlung_durch,
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Unfalldaten */}
            <Section title="Unfalldaten" subtitle="Wann und wo ist der Unfall passiert?">
                <div className="grid grid-cols-1 gap-6">

                    {/* Datum und Zeit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label required>Unfalltag</Label>
                            <Input
                                type="date"
                                value={data.unfalltag}
                                onChange={(e) => updateField('unfalltag', e.target.value)}
                                error={errors['unfalltag']}
                            />
                        </div>
                        <div>
                            <Label required>Unfallzeit</Label>
                            <Input
                                type="time"
                                value={data.unfallzeit}
                                onChange={(e) => updateField('unfallzeit', e.target.value)}
                                error={errors['unfallzeit']}
                            />
                        </div>
                    </div>

                    {/* Arbeitszeiten */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Arbeitszeit Beginn</Label>
                            <Input
                                type="time"
                                value={data.arbeitszeit_beginn}
                                onChange={(e) => updateField('arbeitszeit_beginn', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Arbeitszeit Ende</Label>
                            <Input
                                type="time"
                                value={data.arbeitszeit_ende}
                                onChange={(e) => updateField('arbeitszeit_ende', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Unfallort */}
                    <div>
                        <Label required>Unfallort</Label>
                        <Input
                            placeholder="Genaue Ortsangabe (Gebäude, Raum, Straße)"
                            value={data.unfallort}
                            onChange={(e) => updateField('unfallort', e.target.value)}
                            error={errors['unfallort']}
                        />
                    </div>

                    {/* Unfallhergang */}
                    <div>
                        <Label required>Unfallhergang</Label>
                        <Textarea
                            placeholder="Detaillierte Schilderung des Unfallhergangs..."
                            className="min-h-[120px]"
                            value={data.unfallhergang}
                            onChange={(e) => updateField('unfallhergang', e.target.value)}
                            error={errors['unfallhergang']}
                        />
                    </div>
                </div>
            </Section>

            {/* Verhalten nach Unfall */}
            <Section title="Verhalten nach Unfall" subtitle="Was geschah unmittelbar nach dem Unfall?">
                <div>
                    <Label required>Verhalten nach dem Unfall</Label>
                    <Textarea
                        placeholder="z.B. Arbeit eingestellt, weitergearbeitet, Erste Hilfe geleistet..."
                        value={data.verhalten_nach_unfall}
                        onChange={(e) => updateField('verhalten_nach_unfall', e.target.value)}
                        error={errors['verhalten_nach_unfall']}
                    />
                </div>
            </Section>

            {/* Erstversorgung */}
            <Section title="Erstversorgung" subtitle="Maßnahmen unmittelbar nach dem Unfall">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Label required>Art der Erstversorgung</Label>
                        <Textarea
                            placeholder="z.B. Wundverband angelegt, Kühlung, Ruhigstellung..."
                            value={data.art_erstversorgung}
                            onChange={(e) => updateField('art_erstversorgung', e.target.value)}
                            error={errors['art_erstversorgung']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label required>Erstbehandlung am</Label>
                            <Input
                                type="date"
                                value={data.erstbehandlung_datum}
                                onChange={(e) => updateField('erstbehandlung_datum', e.target.value)}
                                error={errors['erstbehandlung_datum']}
                            />
                        </div>
                        <div>
                            <Label required>Erstbehandlung durch</Label>
                            <Input
                                placeholder="Name des Arztes / Ersthelfers"
                                value={data.erstbehandlung_durch}
                                onChange={(e) => updateField('erstbehandlung_durch', e.target.value)}
                                error={errors['erstbehandlung_durch']}
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
                    Weiter zu Befund →
                </button>
            </div>
        </div>
    );
}