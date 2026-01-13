import {
  EditProfileFormSchema,
  EditProfileFormState,
} from "@/lib/type/editProfile";

export async function editProfileAction(
  formData: FormData
): Promise<EditProfileFormState> {
  const validatedFields = EditProfileFormSchema.safeParse({
    vorname: formData.get("vorname"),
    nachname: formData.get("nachname"),
    email: formData.get("email"),
    praxis_name: formData.get("praxis_name"),
    praxis_telefon: formData.get("praxis_telefon"),
    durchgangsarzt_nr: formData.get("durchgangsarzt_nr"),
    praxis_strasse: formData.get("praxis_strasse"),
    praxis_plz: formData.get("praxis_plz"),
    praxis_ort: formData.get("praxis_ort"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    vorname,
    nachname,
    email,
    praxis_name,
    praxis_telefon,
    durchgangsarzt_nr,
    praxis_strasse,
    praxis_plz,
    praxis_ort,
  } = validatedFields.data;
}
