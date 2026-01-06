"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/utils/logo";
import { authApi } from '@/lib/api';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";



export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(email, password);

            // Token speichern
            localStorage.setItem('access_token', response.access_token);

            // Zum Dashboard
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex items-center space-x-1.5">
                        <Logo
                            className="h-10 w-10 text-foreground dark:text-foreground"
                            aria-hidden={true}
                        />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground dark:text-foreground">
                        Willkommen im DABFORM
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                        Noch kein Konto?{" "}
                        <a
                            href="#"
                            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                        >
                            Konto erstellen
                        </a>
                    </p>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                oder
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {error && (

                            <Alert variant="error">
                                <CircleAlertIcon />
                                <AlertTitle>Fehler</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div>
                            <Label
                                htmlFor="email-login-04"
                                className="text-sm font-medium text-foreground dark:text-foreground"
                            >
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                placeholder="name@praxis-name.de"
                                className="mt-2"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="password-login-04"
                                className="text-sm font-medium text-foreground dark:text-foreground"
                            >
                                Passwort
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                placeholder="**************"
                                className="mt-2"
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="mt-4 w-full py-2 font-medium" disabled={loading}>
                            {
                                loading ? <><Spinner /> Loading...</> : 'Einloggen'
                            }
                        </Button>
                    </form>
                    <p className="mt-6 text-sm text-muted-foreground dark:text-muted-foreground">
                        Passwort vergessen?{" "}
                        <a
                            href="#"
                            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                        >
                            Reset password
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}