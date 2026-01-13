"use client";

import { editProfileAction } from "@/app/actions/profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/utils/logo";
import { User } from "@/types";
import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";

type Errors = Record<string, string | string[]>;

type Props = {
  user: User;
};

const EditForm = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [generalError, setGeneralError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    const formData = new FormData(event.currentTarget);
    try {
      const response = await editProfileAction(formData);
    } catch (error) {
      setGeneralError("Ein unerwarteter Fehler ist aufgetreten");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
          {generalError && (
            <Alert variant="error" className="mb-4">
              <CircleAlertIcon />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center">
            <Logo
              className="h-10 w-10 text-foreground -translate-x-3.5"
              aria-hidden={true}
            />
          </div>

          <div className="relative my-6 hidden">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
          </div>

          <Form className="mt-6 space-y-4" errors={errors} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="first-name">
                    Vorname
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    id="vorname"
                    name="vorname"
                    autoComplete="vorname"
                    placeholder="Vorname"
                    defaultValue={user.vorname}
                    required
                  />
                  <FieldError />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="last-name">
                    Nachname
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    id="last-name"
                    name="nachname"
                    autoComplete="last-name"
                    placeholder="Nachname"
                    defaultValue={user.nachname}
                    disabled={loading}
                    required
                  />
                  <FieldError />
                </Field>
              </div>
              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel htmlFor="email">
                    Email
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email"
                    defaultValue={user.email}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full">
                <Field name="praxis_name">
                  <FieldLabel>Praxis Name</FieldLabel>
                  <Input
                    size="lg"
                    type="text"
                    placeholder="Praxis Name"
                    disabled={loading}
                    defaultValue={user.praxis_name}
                    required
                  />
                  <FieldError />
                </Field>
              </div>
              <div className="col-span-full">
                <Field name="praxis_telefon">
                  <FieldLabel>Praxis Telefon</FieldLabel>
                  <Input
                    size="lg"
                    type="text"
                    placeholder="01234567890"
                    disabled={loading}
                    defaultValue={user.praxis_telefon}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full">
                <Field name="durchgangsarzt_nr">
                  <FieldLabel>Durchgangsarzt Nr.</FieldLabel>
                  <Input
                    size="lg"
                    type="text"
                    placeholder="01234567890"
                    disabled={loading}
                    defaultValue={user.durchgangsarzt_nr}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2">
                  <FieldLabel htmlFor="plz">Ort</FieldLabel>
                  <Input
                    type="text"
                    id="praxis_ort"
                    name="praxis_ort"
                    autoComplete="address-level1"
                    placeholder="Ort"
                    defaultValue={user.praxis_ort}
                    required
                  />
                  <FieldError />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2">
                  <FieldLabel htmlFor="city">Straße</FieldLabel>
                  <Input
                    type="text"
                    id="praxis_strasse"
                    name="praxis_strasse"
                    autoComplete="address-level2"
                    placeholder="Strasse"
                    defaultValue={user.praxis_strasse}
                    required
                  />
                  <FieldError />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Field className="gap-2">
                  <FieldLabel htmlFor="postal-code">PLZ</FieldLabel>
                  <Input
                    id="postal-code"
                    name="praxis_plz"
                    autoComplete="postal-code"
                    placeholder="PLZ"
                    defaultValue={user.praxis_plz}
                    required
                  />
                  <FieldError />
                </Field>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full py-2 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                "Bestätigen"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
