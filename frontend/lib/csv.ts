/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/lib/bericht-csv.ts
import type { Bericht } from "@/types";

const DEFAULT_DELIMITER: ";" | "," = ";";

/** Quotes & delimiter-safe */
function csvEscape(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (
    s.includes('"') ||
    s.includes("\n") ||
    s.includes("\r") ||
    s.includes(delimiter)
  ) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Blob Download */
export function downloadTextFile(
  filename: string,
  content: string,
  mime: string,
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Alle Keys aus einem Bericht (stabil sortiert) */
export function getBerichtHeaders(sample: Bericht): string[] {
  // Object.keys ist ok, aber wir sortieren, damit CSV stabil bleibt.
  return Object.keys(sample).sort();
}

/** Export: Berichte -> CSV (alle Felder) */
export function berichteToCsvAllFields(
  berichte: Bericht[],
  delimiter: ";" | "," = DEFAULT_DELIMITER,
): string {
  if (!berichte.length) {
    // leere CSV mit Standard-Headern wäre nicht sinnvoll -> leere Datei
    return "\uFEFF";
  }

  const headers = getBerichtHeaders(berichte[0]);

  const lines: string[] = [];
  lines.push(headers.join(delimiter));

  for (const b of berichte) {
    const row = headers.map((h) => {
      const v = (b as any)[h];

      // Arrays/Objekte sicher serialisieren (falls später mal vorkommt)
      if (typeof v === "object" && v !== null)
        return csvEscape(JSON.stringify(v), delimiter);

      // Booleans werden "true"/"false"
      return csvEscape(v, delimiter);
    });
    lines.push(row.join(delimiter));
  }

  // BOM für Excel UTF-8
  return "\uFEFF" + lines.join("\n");
}

/** CSV Parser (robust für Excel mit Quotes) + autodetect ; oder , */
export function parseCsvAll(csvText: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const firstLine = text.split("\n")[0] ?? "";
  const semi = (firstLine.match(/;/g) || []).length;
  const comma = (firstLine.match(/,/g) || []).length;
  const delimiter = semi >= comma ? ";" : ",";

  const out: string[][] = [];
  let cur = "";
  let inQuotes = false;
  let row: string[] = [];

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };
  const pushRow = () => {
    if (out.length === 0 && row.length > 0)
      row[0] = row[0].replace(/^\uFEFF/, "");
    out.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        continue;
      }
      cur += ch;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) {
      pushCell();
      continue;
    }
    if (ch === "\n") {
      pushCell();
      pushRow();
      continue;
    }

    cur += ch;
  }
  pushCell();
  pushRow();

  const headers = (out.shift() || []).map((h) => h.trim());
  const rows = out
    .filter((r) => r.some((x) => (x ?? "").trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
      return obj;
    });

  return { headers, rows };
}

/** Typ-Konvertierung passend zu deinem Bericht JSON */
export function csvRowToBerichtPatch(
  row: Record<string, string>,
): Partial<Bericht> {
  const toNull = (v: string) => (v === "" ? null : v);
  const toBool = (v: string) => v.toLowerCase() === "true";
  const toIntOrNull = (v: string) => (v === "" ? null : Number(v));
  const toIntOrUndef = (v: string) => (v === "" ? undefined : Number(v));

  // Felder, die bei euch im JSON vorkommen:
  return {
    // ids
    id: toIntOrUndef(row.id) as any,
    benutzer_id: Number(row.benutzer_id),
    patient_id: Number(row.patient_id),
    uv_traeger_id: toIntOrNull(row.uv_traeger_id) as any,
    unfallbetrieb_id: toIntOrNull(row.unfallbetrieb_id) as any,

    // strings / dates
    lfd_nr: row.lfd_nr,
    status: row.status as any,
    eingetroffen_datum: toNull(row.eingetroffen_datum) as any,
    eingetroffen_uhrzeit: toNull(row.eingetroffen_uhrzeit) as any,
    unfalltag: row.unfalltag as any,
    unfallzeit: toNull(row.unfallzeit) as any,
    unfallort: row.unfallort,

    arbeitszeit_beginn: toNull(row.arbeitszeit_beginn) as any,
    arbeitszeit_ende: toNull(row.arbeitszeit_ende) as any,

    unfallhergang: toNull(row.unfallhergang) as any,
    taetigkeit_bei_unfall: toNull(row.taetigkeit_bei_unfall) as any,
    verhalten_nach_unfall: toNull(row.verhalten_nach_unfall) as any,

    art_erstversorgung: toNull(row.art_erstversorgung) as any,
    erstbehandlung_datum: toNull(row.erstbehandlung_datum) as any,
    erstbehandlung_durch: toNull(row.erstbehandlung_durch) as any,

    alkohol_drogen_anzeichen: toNull(row.alkohol_drogen_anzeichen) as any,
    beschwerden_klagen: toNull(row.beschwerden_klagen) as any,
    gebrauchshand: toNull(row.gebrauchshand) as any,
    klinische_befunde: toNull(row.klinische_befunde) as any,
    iss_score: toNull(row.iss_score) as any,

    bildgebende_diagnostik: toNull(row.bildgebende_diagnostik) as any,
    erstdiagnose_freitext: toNull(row.erstdiagnose_freitext) as any,
    erstdiagnose_icd10: toNull(row.erstdiagnose_icd10) as any,
    erstdiagnose_ao: toNull(row.erstdiagnose_ao) as any,

    art_da_versorgung: toNull(row.art_da_versorgung) as any,
    vorerkrankungen: toNull(row.vorerkrankungen) as any,

    zweifel_begruendung: toNull(row.zweifel_begruendung) as any,

    heilbehandlung_art: toNull(row.heilbehandlung_art) as any,
    keine_heilbehandlung_grund: toNull(row.keine_heilbehandlung_grund) as any,
    verletzung_vav_ziffer: toNull(row.verletzung_vav_ziffer) as any,
    verletzung_sav_ziffer: toNull(row.verletzung_sav_ziffer) as any,

    weiterbehandlung_durch: toNull(row.weiterbehandlung_durch) as any,
    anderer_arzt_name: toNull(row.anderer_arzt_name) as any,
    anderer_arzt_adresse: toNull(row.anderer_arzt_adresse) as any,

    arbeitsfaehig:
      row.arbeitsfaehig === "" ? undefined : toBool(row.arbeitsfaehig),
    arbeitsunfaehig_ab: toNull(row.arbeitsunfaehig_ab) as any,
    arbeitsfaehig_ab: toNull(row.arbeitsfaehig_ab) as any,

    weitere_aerzte_namen: toNull(row.weitere_aerzte_namen) as any,
    wiedervorstellung_datum: toNull(row.wiedervorstellung_datum) as any,
    bemerkungen: toNull(row.bemerkungen) as any,
    weitere_ausfuehrungen: toNull(row.weitere_ausfuehrungen) as any,
    mitteilung_behandelnder_arzt: toNull(
      row.mitteilung_behandelnder_arzt,
    ) as any,
    datum_mitteilung_behandelnder_arzt: toNull(
      row.datum_mitteilung_behandelnder_arzt,
    ) as any,

    // booleans
    kopie_an_kasse: toBool(row.kopie_an_kasse),
    ist_pflegeunfall: toBool(row.ist_pflegeunfall),
    verdacht_alkohol_drogen: toBool(row.verdacht_alkohol_drogen),
    blutentnahme_durchgefuehrt: toBool(row.blutentnahme_durchgefuehrt),
    handverletzung: toBool(row.handverletzung),
    polytrauma: toBool(row.polytrauma),
    zweifel_arbeitsunfall: toBool(row.zweifel_arbeitsunfall),
    verletzung_vav: toBool(row.verletzung_vav),
    verletzung_sav: toBool(row.verletzung_sav),
    au_laenger_3_monate: toBool(row.au_laenger_3_monate),
    weitere_aerzte_noetig: toBool(row.weitere_aerzte_noetig),
    wiedervorstellung_mitgeteilt: toBool(row.wiedervorstellung_mitgeteilt),
    datenschutz_hinweis_gegeben: toBool(row.datenschutz_hinweis_gegeben),
    ergaenzung_kopfverletzung: toBool(row.ergaenzung_kopfverletzung),
    ergaenzung_knieverletzung: toBool(row.ergaenzung_knieverletzung),
    ergaenzung_schulterverletzung: toBool(row.ergaenzung_schulterverletzung),
    ergaenzung_verbrennung: toBool(row.ergaenzung_verbrennung),

    // timestamps (lassen wir als string)
    erstellt_am: row.erstellt_am as any,
    aktualisiert_am: toNull(row.aktualisiert_am) as any,
    abgeschlossen_am: toNull(row.abgeschlossen_am) as any,
    pdf_generiert_am: toNull(row.pdf_generiert_am) as any,
  };
}
