"use client";

import React, { forwardRef } from "react";
import { useWatch } from "react-hook-form";

// ==========================================
// 1. Debug Panel (Das hat gefehlt)
// ==========================================
export const DebugPanel = React.memo(function DebugPanel({ control }: { control: any }) {
  const values = useWatch({ control });

  return (
    <div className="bg-slate-100 p-4 rounded-lg mb-4 border border-slate-200 mt-8">
      <h3 className="font-semibold mb-2 text-slate-700 text-xs uppercase tracking-wider">
        Live Debug Werte
      </h3>
      <pre className="text-[10px] font-mono text-slate-600 overflow-auto max-h-[300px] bg-white rounded p-3 border border-slate-200">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
});

// ==========================================
// 2. Label
// ==========================================
export const Label = ({
  children,
  required,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <label className={`block text-[11px] font-medium text-slate-700 mb-1.5 ${className ?? ""}`}>
    {children}
    {required && <span className="text-red-500"> *</span>}
  </label>
);

// ==========================================
// 3. Input
// ==========================================
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ error, className, ...props }, ref) => (
  <div className={className}>
    <input
      ref={ref}
      {...props}
      className={[
        "w-full h-9 px-3 rounded-md border bg-white text-sm text-slate-900 transition-all",
        "placeholder:text-slate-400",
        error 
          ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400" 
          : "border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none",
        props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "",
      ].join(" ")}
    />
    {error && <p className="mt-1 text-[11px] font-medium text-red-600 animate-in slide-in-from-top-1">{error}</p>}
  </div>
));
Input.displayName = "Input";

// ==========================================
// 4. Textarea
// ==========================================
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ error, className, ...props }, ref) => (
  <div className={className}>
    <textarea
      ref={ref}
      {...props}
      className={[
        "w-full min-h-[90px] px-3 py-2 rounded-md border bg-white text-sm text-slate-900 transition-all",
        "placeholder:text-slate-400",
        error 
          ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400" 
          : "border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none",
        props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "",
      ].join(" ")}
    />
    {error && <p className="mt-1 text-[11px] font-medium text-red-600 animate-in slide-in-from-top-1">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";

// ==========================================
// 5. Select
// ==========================================
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
    error?: string;
  }
>(({ options, error, className, ...props }, ref) => (
  <div className={className}>
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className={[
          "w-full h-9 pl-3 pr-8 rounded-md border bg-white text-sm text-slate-900 appearance-none transition-all",
          error 
            ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400" 
            : "border-slate-200 focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none",
          props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {/* Custom Arrow Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
    {error && <p className="mt-1 text-[11px] font-medium text-red-600 animate-in slide-in-from-top-1">{error}</p>}
  </div>
));
Select.displayName = "Select";

// ==========================================
// 6. Checkbox (falls du sie brauchst)
// ==========================================
export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      {...props}
      className={[
        "h-3.5 w-3.5 rounded border border-slate-300",
        "text-black focus:ring-2 focus:ring-slate-200 accent-slate-900",
        className ?? "",
      ].join(" ")}
    />
  )
);
Checkbox.displayName = "Checkbox";

// ==========================================
// 7. Section Layout
// ==========================================
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
        {subtitle && <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{subtitle}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}