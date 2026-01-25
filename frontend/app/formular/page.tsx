"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormularPage from "./FormularPage";

function FormularContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const berichtId = idParam ? parseInt(idParam, 10) : undefined;

  return <FormularPage berichtId={berichtId} />;
}

export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 mx-auto mb-4" />
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    }>
      <FormularContent />
    </Suspense>
  );
}
