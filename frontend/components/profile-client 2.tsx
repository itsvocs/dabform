'use client';

import { User } from "@/types";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {

    Building2,
    Phone,
    Calendar,
    FileText,
    Shield,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    user: User;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string | number | boolean | undefined;
    icon?: React.ComponentType<{ className?: string }>;
}) => {
    if (value === undefined || value === null || value === "") return null;

    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                    {label}
                </div>
                <div className="text-sm text-foreground wrap-break-word">
                    {typeof value === "boolean" ? (value ? "Ja" : "Nein") : String(value)}
                </div>
            </div>
        </div>
    );
};

export default function ProfileClient({ user }: ProfileClientProps) {
    const router = useRouter();

    const fullName = [user.titel, user.vorname, user.nachname]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Zurück zum Dashboard
                    </Button>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">

                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
                            <p className="text-muted-foreground mt-1">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => router.push('/profile/edit')}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Bearbeiten
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Persönliche Informationen
                        </CardTitle>
                    </CardHeader>
                    <CardPanel className="space-y-1">
                        <InfoRow label="Vorname" value={user.vorname} />
                        <InfoRow label="Nachname" value={user.nachname} />
                        {user.titel && (
                            <InfoRow label="Titel" value={user.titel} />
                        )}
                        <InfoRow label="E-Mail" value={user.email} />
                        <InfoRow label="Benutzer-ID" value={user.id} />
                    </CardPanel>
                </Card>

                {/* Practice Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Praxisinformationen
                        </CardTitle>
                    </CardHeader>
                    <CardPanel className="space-y-1">
                        {user.praxis_name ? (
                            <InfoRow
                                label="Praxisname"
                                value={user.praxis_name}
                                icon={Building2}
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground py-4">
                                Keine Praxisinformationen hinterlegt
                            </div>
                        )}
                        {user.praxis_telefon && (
                            <InfoRow
                                label="Praxis Telefon"
                                value={user.praxis_telefon}
                                icon={Phone}
                            />
                        )}
                        {user.durchgangsarzt_nr && (
                            <InfoRow
                                label="Durchgangsarzt-Nr."
                                value={user.durchgangsarzt_nr}
                                icon={FileText}
                            />
                        )}
                    </CardPanel>
                </Card>

                {/* Account Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Kontoinformationen
                        </CardTitle>
                    </CardHeader>
                    <CardPanel className="space-y-1">
                        <InfoRow
                            label="Erstellt am"
                            value={formatDate(user.erstellt_am)}
                            icon={Calendar}
                        />
                        {user.aktualisiert_am && (
                            <InfoRow
                                label="Aktualisiert am"
                                value={formatDate(user.aktualisiert_am)}
                                icon={Calendar}
                            />
                        )}
                        <InfoRow
                            label="Kontostatus"
                            value={user.aktiv ? "Aktiv" : "Inaktiv"}
                            icon={user.aktiv ? CheckCircle2 : XCircle}
                        />
                        <InfoRow
                            label="Benutzerrolle"
                            value={user.rolle === "arzt" ? "Durchgangsarzt" : "Administrator"}
                            icon={Shield}
                        />
                    </CardPanel>
                </Card>
            </div>
        </div>
    );
}