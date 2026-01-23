// app/formular/steps/Step5Abschluss.tsx
'use client';

import { useState } from 'react';
import { Section, Label, Textarea, Checkbox } from '../components/FormUI';
import { FormularData } from '@/types/formular';

interface Props {
    data: FormularData;
    onChange: (data: Partial<FormularData>) => void;
    onBack: () => void;
    onSubmit: (data: Partial<FormularData>) => void;
    isSubmitting: boolean;
}

export function Step5Abschluss({ data, onChange, onBack, onSubmit, isSubmitting }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: keyof FormularData, value: string | boolean) => {
        onChange({ [field]: value });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data.mitteilung_behandelnder_arzt) {
            newErrors['mitteilung_behandelnder_arzt'] = 'Name/Stempel ist Pflicht';
        }
        if (!data.datenschutz_hinweis_gegeben) {
            newErrors['datenschutz_hinweis_gegeben'] = 'Datenschutz-Hinweis muss bestätigt werden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit({
                bemerkungen: data.bemerkungen,
                weitere_ausfuehrungen: data.weitere_ausfuehrungen,
                mitteilung_behandelnder_arzt: data.mitteilung_behandelnder_arzt,
                datenschutz_hinweis_gegeben: data.datenschutz_hinweis_gegeben,
                ergaenzung_kopfverletzung: data.ergaenzung_kopfverletzung,
                ergaenzung_knieverletzung: data.ergaenzung_knieverletzung,
                ergaenzung_schulterverletzung: data.ergaenzung_schulterverletzung,
                ergaenzung_verbrennung: data.ergaenzung_verbrennung,
            });
        }
    };

    // Formatierung für Anzeige
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('de-DE');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Zusammenfassung */}
            <Section title="Zusammenfassung" subtitle="Überblick der erfassten Daten">
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">

                    {/* Patient */}
                    <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Patientendaten
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Name:</span>
                                <span className="ml-2 font-medium">
                                    {data.patient.vorname} {data.patient.nachname}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Geburtsdatum:</span>
                                <span className="ml-2 font-medium">{formatDate(data.patient.geburtsdatum)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Unfall */}
                    <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Unfalldaten
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Lfd. Nr.:</span>
                                <span className="ml-2 font-medium">{data.lfd_nr || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Unfalltag:</span>
                                <span className="ml-2 font-medium">{formatDate(data.unfalltag)}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-500">Unfallort:</span>
                                <span className="ml-2 font-medium">{data.unfallort || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Diagnose */}
                    <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Diagnose
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">ICD-10:</span>
                                <span className="ml-2 font-medium">{data.erstdiagnose_icd10 || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">AO:</span>
                                <span className="ml-2 font-medium">{data.erstdiagnose_ao || '-'}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-500">Diagnose:</span>
                                <span className="ml-2 font-medium">{data.erstdiagnose_freitext || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Behandlungsstatus
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Arbeitsfähig:</span>
                                <span className={`ml-2 font-medium ${data.arbeitsfaehig === false ? 'text-red-600' : 'text-green-600'}`}>
                                    {data.arbeitsfaehig === null ? '-' : data.arbeitsfaehig ? 'Ja' : 'Nein'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Wiedervorstellung:</span>
                                <span className="ml-2 font-medium">{formatDate(data.wiedervorstellung_datum)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Ergänzungsberichte */}
            <Section title="Ergänzungsberichte" subtitle="Erforderliche Zusatzformulare">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-4">
                        Markieren Sie, falls Ergänzungsberichte erforderlich sind:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Checkbox
                            label="F 1002 - Kopfverletzung"
                            checked={data.ergaenzung_kopfverletzung}
                            onChange={(e) => updateField('ergaenzung_kopfverletzung', e.target.checked)}
                        />
                        <Checkbox
                            label="F 1004 - Knieverletzung"
                            checked={data.ergaenzung_knieverletzung}
                            onChange={(e) => updateField('ergaenzung_knieverletzung', e.target.checked)}
                        />
                        <Checkbox
                            label="F 1006 - Schulterverletzung"
                            checked={data.ergaenzung_schulterverletzung}
                            onChange={(e) => updateField('ergaenzung_schulterverletzung', e.target.checked)}
                        />
                        <Checkbox
                            label="F 1008 - Schwere Verbrennung"
                            checked={data.ergaenzung_verbrennung}
                            onChange={(e) => updateField('ergaenzung_verbrennung', e.target.checked)}
                        />
                    </div>
                </div>
            </Section>

            {/* Bemerkungen */}
            <Section title="Bemerkungen" subtitle="Zusätzliche Anmerkungen">
                <div className="space-y-6">
                    <div>
                        <Label>Bemerkungen</Label>
                        <Textarea
                            placeholder="Optionale Bemerkungen zum Bericht..."
                            value={data.bemerkungen}
                            onChange={(e) => updateField('bemerkungen', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Weitere Ausführungen (Seite 2)</Label>
                        <Textarea
                            placeholder="Zusätzliche Ausführungen falls erforderlich..."
                            className="min-h-[120px]"
                            value={data.weitere_ausfuehrungen}
                            onChange={(e) => updateField('weitere_ausfuehrungen', e.target.value)}
                        />
                    </div>
                </div>
            </Section>

            {/* Unterschrift */}
            <Section title="Abschluss & Signatur" subtitle="Angaben zum unterzeichnenden Arzt">
                <div className="space-y-6">
                    <div>
                        <Label required>Name & Anschrift des Durchgangsarztes (Stempel)</Label>
                        <Textarea
                            placeholder="Dr. med. Mustermann&#10;Musterstraße 1&#10;12345 Musterstadt"
                            className="min-h-[120px] font-medium"
                            value={data.mitteilung_behandelnder_arzt}
                            onChange={(e) => updateField('mitteilung_behandelnder_arzt', e.target.value)}
                            error={errors['mitteilung_behandelnder_arzt']}
                        />
                    </div>
                </div>
            </Section>

            {/* Datenschutz */}
            <Section title="Datenschutz" subtitle="Rechtliche Bestätigung">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                            <input
                                type="checkbox"
                                id="datenschutz"
                                checked={data.datenschutz_hinweis_gegeben}
                                onChange={(e) => updateField('datenschutz_hinweis_gegeben', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="datenschutz" className="text-sm font-medium text-slate-900 cursor-pointer block">
                                Bestätigung nach § 201 SGB VII *
                            </label>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Ich bestätige hiermit, dass der versicherten Person der Hinweis gemäß § 201 SGB VII
                                gegeben wurde, dass die Daten an die gesetzliche Unfallversicherung übermittelt werden.
                            </p>
                            {errors['datenschutz_hinweis_gegeben'] && (
                                <p className="mt-2 text-[11px] font-bold text-red-600">
                                    {errors['datenschutz_hinweis_gegeben']}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            {/* System Info */}
            <div className="text-center py-4 border-t border-slate-100 text-xs text-slate-400">
                <p>
                    Bericht-Nr: {data.lfd_nr || 'Neu'} •
                    Formular: F 1000 Durchgangsarztbericht
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="text-slate-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    ← Zurück
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Wird gespeichert...
                        </span>
                    ) : (
                        'Bericht abschließen ✓'
                    )}
                </button>
            </div>
        </div>
    );
}