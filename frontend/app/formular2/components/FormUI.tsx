// app/formular/components/FormUI.tsx
'use client';

import React from 'react';

// Label
export function Label({
    children,
    required,
    className,
}: {
    children: React.ReactNode;
    required?: boolean;
    className?: string;
}) {
    return (
        <label className={`block text-[11px] font-medium text-slate-700 mb-1.5 ${className ?? ''}`}>
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
    return (
        <div className={className}>
            <input
                {...props}
                className={[
                    'w-full h-9 px-3 rounded-md border bg-white text-sm text-slate-900 transition-all',
                    'placeholder:text-slate-400 outline-none',
                    error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400',
                    props.disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : '',
                ].join(' ')}
            />
            {error && (
                <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
    return (
        <div className={className}>
            <textarea
                {...props}
                className={[
                    'w-full min-h-[90px] px-3 py-2 rounded-md border bg-white text-sm text-slate-900 transition-all',
                    'placeholder:text-slate-400 outline-none',
                    error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400',
                    props.disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : '',
                ].join(' ')}
            />
            {error && (
                <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    error?: string;
}

export function Select({ options, error, className, ...props }: SelectProps) {
    return (
        <div className={className}>
            <select
                {...props}
                className={[
                    'w-full h-9 pl-3 pr-8 rounded-md border bg-white text-sm text-slate-900 appearance-none transition-all outline-none',
                    error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400',
                    props.disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : '',
                ].join(' ')}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}

// Checkbox
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${className ?? ''}`}>
            <input
                type="checkbox"
                {...props}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 accent-slate-900"
            />
            {label && <span className="text-sm text-slate-700">{label}</span>}
        </label>
    );
}

// Section
export function Section({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-8 gap-y-4 py-8 border-t border-slate-100 first:border-0">
            <div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                {subtitle && (
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{subtitle}</p>
                )}
            </div>
            <div className="space-y-6">{children}</div>
        </section>
    );
}
