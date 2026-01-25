'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/utils/logo";
import { authApi } from '@/lib/api';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useAuth } from '@/contexts/auth-context';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const response = await authApi.login(email, password);
            await login(response.access_token); // Context aktualisiert
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login fehlgeschlagen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center ">
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex items-center">
                        <Logo className="h-10 w-10 text-foreground -translate-x-3.5" aria-hidden={true} />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground">
                        Melden Sie sich in Ihrem Konto an
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Noch kein Konto?{" "}
                        <Link href="/register" className="font-medium text-primary hover:text-primary/90">
                            Konto anfordern
                        </Link>
                    </p>

                    <div className="relative my-6 hidden">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                    </div>

                    {error && (
                        <Alert variant="error" className="mb-4">
                            <CircleAlertIcon />
                            <AlertTitle>Fehler</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                size="lg"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@praxis-name.de"
                                className="mt-2"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium">Passwort</label>
                            <Input
                                size="lg"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="**************"
                                className="mt-2"
                                disabled={loading}
                                required
                            />
                        </div>

                        <Button type="submit" className="mt-4 w-full py-2 font-medium" disabled={loading}>
                            {loading ? <><Spinner /> Loading...</> : "Einloggen"}
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-muted-foreground">
                        Passwort vergessen?{" "}
                        <Link href="/reset-password" className="font-medium text-primary hover:text-primary/90">
                            Passwort zurücksetzen
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}