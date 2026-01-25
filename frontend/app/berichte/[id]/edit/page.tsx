import { redirect } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBerichtPage({ params }: EditPageProps) {
  const { id } = await params;
  
  // Redirect to formular page with id parameter
  redirect(`/formular?id=${id}`);
}
