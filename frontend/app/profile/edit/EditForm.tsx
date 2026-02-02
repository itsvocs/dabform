"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/utils/logo";
import { User } from "@/types";
import { CircleAlertIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toastManager } from "@/components/ui/toast";

type Errors = Record<string, string | string[]>;

type Props = {
  user: User;
};

const EditForm = ({ user }: Props) => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [generalError, setGeneralError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    const formData = new FormData(event.currentTarget);

    const updateData = {
      vorname: formData.get("vorname") as string,
      nachname: formData.get("nachname") as string,
      email: formData.get("email") as string,
      titel: formData.get("titel") as string || undefined,
      praxis_name: formData.get("praxis_name") as string || undefined,
      praxis_telefon: formData.get("praxis_telefon") as string || undefined,
      praxis_strasse: formData.get("praxis_strasse") as string || undefined,
      praxis_plz: formData.get("praxis_plz") as string || undefined,
      praxis_ort: formData.get("praxis_ort") as string || undefined,
      durchgangsarzt_nr: formData.get("durchgangsarzt_nr") as string || undefined,
    };

    try {
      const response = await fetch('/api/benutzer/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Update fehlgeschlagen');
      }

      toastManager.add({
        type: "success",
        description: "Profil erfolgreich aktualisiert."
      })

      await refreshUser(); // Context aktualisieren

      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/profile')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Profil
          </Button>

          {generalError && (
            <Alert variant="error" className="mb-4">
              <CircleAlertIcon />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="flex items-center mb-6">
            <Logo
              className="h-10 w-10 text-foreground -translate-x-3.5"
              aria-hidden={true}
            />
            <h2 className="text-2xl font-bold">Profil bearbeiten</h2>
          </div>

          <Form className="space-y-6" errors={errors} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              {/* Persönliche Daten */}
              <div className="col-span-full">
                <h3 className="text-lg font-semibold mb-4">Persönliche Daten</h3>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2" name="titel">
                  <FieldLabel>Titel</FieldLabel>
                  <Input
                    type="text"
                    name="titel"
                    placeholder="Dr."
                    key={`input-${user.titel}`}
                    defaultValue={user.titel}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2" name="vorname">
                  <FieldLabel>
                    Vorname <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    name="vorname"
                    placeholder="Vorname"
                    key={`input-${user.vorname}`}
                    defaultValue={user.vorname}
                    disabled={loading}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2" name="nachname">
                  <FieldLabel>
                    Nachname <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    name="nachname"
                    placeholder="Nachname"
                    key="input-nachname"
                    defaultValue={user.nachname}
                    disabled={loading}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full">
                <Field className="gap-2" name="email">
                  <FieldLabel>
                    Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    key={`input-${user.email}`}
                    defaultValue={user.email}
                    disabled={loading}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              {/* Praxisdaten */}
              <div className="col-span-full mt-4">
                <Separator className="mb-4" />
                <h3 className="text-lg font-semibold mb-4">Praxisinformationen</h3>
              </div>

              <div className="col-span-full">
                <Field name="praxis_name">
                  <FieldLabel>Praxis Name</FieldLabel>
                  <Input
                    type="text"
                    name="praxis_name"
                    placeholder="Praxis Name"
                    key={`input-praxis_name`}
                    defaultValue={user.praxis_name}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field name="praxis_telefon">
                  <FieldLabel>Praxis Telefon</FieldLabel>
                  <Input
                    type="text"
                    name="praxis_telefon"
                    placeholder="01234567890"
                    key={`input-telefon`}
                    defaultValue={user.praxis_telefon}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field name="durchgangsarzt_nr">
                  <FieldLabel>Durchgangsarzt Nr.</FieldLabel>
                  <Input
                    type="text"
                    name="durchgangsarzt_nr"
                    placeholder="D-Arzt Nummer"
                    key={`input-durchgangsarzt_nr`}
                    defaultValue={user.durchgangsarzt_nr}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-4">
                <Field className="gap-2" name="praxis_strasse">
                  <FieldLabel>Straße</FieldLabel>
                  <Input
                    type="text"
                    name="praxis_strasse"
                    placeholder="Musterstraße 1"
                    key={`input-praxis_strasse`}
                    defaultValue={user.praxis_strasse}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2" name="praxis_plz">
                  <FieldLabel>PLZ</FieldLabel>
                  <Input
                    name="praxis_plz"
                    placeholder="12345"
                    key={`input-plz`}
                    defaultValue={user.praxis_plz}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full">
                <Field className="gap-2" name="praxis_ort">
                  <FieldLabel>Ort</FieldLabel>
                  <Input
                    type="text"
                    name="praxis_ort"
                    placeholder="Stadt"
                    key={`input-stadt`}
                    defaultValue={user.praxis_ort}
                    disabled={loading}
                  />
                  <FieldError />
                </Field>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/profile')}
                disabled={loading}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2" /> Speichern...
                  </>
                ) : (
                  "Änderungen speichern"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;