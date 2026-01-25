"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/utils/logo";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Form } from "@/components/ui/form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { resetPasswordAction } from "../actions/auth";
import { useRouter } from "next/navigation";

type Errors = Record<string, string | string[]>;

export default function Login() {
  const router = useRouter();
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
      const response = await resetPasswordAction(formData);

      if (response?.errors) {
        setErrors(response.errors as Errors);
      }

      if (response?.message) {
        setGeneralError(response.message);
      }

      if (response?.success) {
        router.push("/login");
      }
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
            <Field name="currentPassword">
              <FieldLabel>Aktuelles Passwort</FieldLabel>
              <Input
                size="lg"
                type="password"
                placeholder="**************"
                disabled={loading}
              />
              <FieldError />
            </Field>

            <Field name="newPassword">
              <FieldLabel>Neues Passwort</FieldLabel>
              <Input
                size="lg"
                type="password"
                placeholder="**************"
                disabled={loading}
              />
              <FieldError />
            </Field>

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
                "Passwort ändern"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
