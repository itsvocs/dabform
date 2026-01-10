import { User } from "@/types";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  Mail,
  Building2,
  Phone,
  Calendar,
  FileText,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const getUser = async (id: string) : Promise<User> => {
  const user = {
    id: parseInt(id),
    email: "john.doe@example.com",
    vorname: "John",
    nachname: "Doe",
    titel: "Dr.",
    rolle: "arzt" as "arzt" | "admin",
    aktiv: true,
    durchgangsarzt_nr: "1234567890",
    praxis_name: "Praxis Name",
    praxis_telefon: "1234567890",
    erstellt_am: new Date().toISOString(),
    aktualisiert_am: new Date().toISOString(),
  };
  return user;
};

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
  icon: Icon,
}: {
  label: string;
  value: string | number | boolean | undefined;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex items-start gap-3 py-3">
      {Icon && (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
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

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const user = await getUser(id);

  const fullName = [user.titel, user.vorname, user.nachname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={user.aktiv ? "success" : "error"}
              size="lg"
              className="gap-1.5"
            >
              {user.aktiv ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {user.aktiv ? "Aktiv" : "Inaktiv"}
            </Badge>
            <Badge variant="outline" size="lg" className="gap-1.5 capitalize">
              <Shield className="h-3.5 w-3.5" />
              {user.rolle === "arzt" ? "Arzt" : "Administrator"}
            </Badge>
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
              <UserIcon className="h-5 w-5" />
              Persönliche Informationen
            </CardTitle>
          </CardHeader>
          <CardPanel className="space-y-1">
            <InfoRow label="Vorname" value={user.vorname} icon={UserIcon} />
            <InfoRow label="Nachname" value={user.nachname} icon={UserIcon} />
            {user.titel && (
              <InfoRow label="Titel" value={user.titel} icon={UserIcon} />
            )}
            <InfoRow label="E-Mail" value={user.email} icon={Mail} />
            <InfoRow label="Benutzer-ID" value={user.id} icon={FileText} />
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
            {user.praxis_name && (
              <InfoRow
                label="Praxisname"
                value={user.praxis_name}
                icon={Building2}
              />
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
              label="Status"
              value={user.aktiv}
              icon={user.aktiv ? CheckCircle2 : XCircle}
            />
            <InfoRow
              label="Rolle"
              value={user.rolle === "arzt" ? "Arzt" : "Administrator"}
              icon={Shield}
            />
          </CardPanel>
        </Card>
      </div>
    </div>
  );
};

export default page;
