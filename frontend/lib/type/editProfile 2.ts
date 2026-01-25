import * as z from "zod";

export const EditProfileFormSchema = z.object({
  vorname: z.string().min(1, { message: "Vorname ist erforderlich." }).trim(),
  nachname: z.string().min(1, { message: "Nachname ist erforderlich." }).trim(),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }).trim(),
  praxis_name: z
    .string()
    .min(1, { message: "Praxisname ist erforderlich." })
    .trim(),
  praxis_telefon: z
    .string()
    .min(1, { message: "Praxistelefon ist erforderlich." })
    .trim(),
  durchgangsarzt_nr: z
    .string()
    .min(1, { message: "Durchgangsarzt-Nr. ist erforderlich." })
    .trim(),
  praxis_strasse: z
    .string()
    .min(1, { message: "Praxisstraße ist erforderlich." })
    .trim(),
  praxis_plz: z
    .string()
    .min(1, { message: "Praxisplz ist erforderlich." })
    .trim(),
  praxis_ort: z
    .string()
    .min(1, { message: "Praxisort ist erforderlich." })
    .trim(),
});
export type EditProfileFormState =
  | {
      errors?: {
        vorname?: string[];
        nachname?: string[];
        email?: string[];
        praxis_name?: string[];
        praxis_telefon?: string[];
        durchgangsarzt_nr?: string[];
        praxis_strasse?: string[];
        praxis_plz?: string[];
        praxis_ort?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
