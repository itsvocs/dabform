import { User } from "@/types";
import EditForm from "./EditForm";

const getUser = async (id: string): Promise<User> => {
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
    praxis_strasse: 9,
    praxis_plz: "12345",
    praxis_ort: "München",
    erstellt_am: new Date().toISOString(),
    aktualisiert_am: new Date().toISOString(),
  };

  return user;
};

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const user = await getUser(id);

  return <EditForm user={user} />;
};

export default page;
