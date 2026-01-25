"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  FileText,
  Play,
  AlertTriangle,
  X,
  Search,
  NotepadTextDashed,
  FileCheck,
} from "lucide-react";
// import { berichteApi } from "@/lib/api";
import type { User, Bericht } from "@/types";
import { Input } from "@/components/ui/input";

interface DashboardClientProps {
  user: User;
  initialBerichte: Bericht[];
}

type BerichtStatus = "entwurf" | "abgeschlossen";

export default function DashboardClient({ user, initialBerichte }: DashboardClientProps) {
  const [berichte, setBerichte] = useState<Bericht[]>(initialBerichte);
  const [searchTerm, setSearchTerm] = useState("");
  // const [loading, setLoading] = useState(false);

  // Modals & Alert State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    berichtId: number | null;
  }>({
    isOpen: false,
    berichtId: null,
  });
  const [navModal, setNavModal] = useState<{
    isOpen: boolean;
    berichtId: number | null;
    type: "edit" | "view";
  }>({
    isOpen: false,
    berichtId: null,
    type: "view",
  });
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Archivierungsfrist prüfen (30 Jahre)
  const isOlderThan30Years = (dateString: string) => {
    const accidentDate = new Date(dateString);
    const today = new Date();
    const cutoffDate = new Date(
      today.getFullYear() - 30,
      today.getMonth(),
      today.getDate()
    );
    return accidentDate < cutoffDate;
  };

  // Filtern
  const filteredBerichte = berichte.filter(
    (b) =>
      b.lfd_nr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patient_id.toString().includes(searchTerm)
  );

  // Löschen Handler
  const handleDeleteRequest = (bericht: Bericht) => {
    if (bericht.status === "abgeschlossen") {
      if (isOlderThan30Years(bericht.unfalltag)) {
        setDeleteModal({ isOpen: true, berichtId: bericht.id });
      } else {
        setAlertMsg(
          "Löschen nicht möglich: Archivierungsfrist von 30 Jahren noch nicht abgelaufen."
        );
        setTimeout(() => setAlertMsg(null), 4000);
      }
    } else {
      // Entwürfe können immer gelöscht werden
      setDeleteModal({ isOpen: true, berichtId: bericht.id });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.berichtId) return;

    try {
      // API Call zum Löschen
      const response = await fetch(`/api/berichte/${deleteModal.berichtId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBerichte((prev) =>
          prev.filter((b) => b.id !== deleteModal.berichtId)
        );
        setDeleteModal({ isOpen: false, berichtId: null });
      } else {
        const error = await response.json();
        setAlertMsg(error.detail || "Fehler beim Löschen");
        setTimeout(() => setAlertMsg(null), 4000);
      }
    } catch (error) {
      setAlertMsg("Fehler beim Löschen des Berichts");
      setTimeout(() => setAlertMsg(null), 4000);
    }
  };

  const handleNavigationRequest = (berichtId: number, type: "edit" | "view") => {
    setNavModal({ isOpen: true, berichtId, type });
  };

  // Status Badge
  const StatusBadge = ({ status }: { status: BerichtStatus }) => {
    const styles = {
      entwurf: "bg-orange-50 text-orange-700 border-orange-200",
      abgeschlossen: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${styles[status]}`}
      >
        {status === "entwurf" ? "Entwurf" : "Abgeschlossen"}
      </span>
    );
  };

  // Action Buttons
  const actionBtn =
    "h-6 w-6 inline-flex items-center justify-center rounded border bg-white hover:bg-slate-50 transition";
  const actionBtnDanger =
    "h-6 w-6 inline-flex items-center justify-center rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 transition";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header mit Logout */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <p className="text-2xl text-muted-foreground">Willkommen zurück,</p>
          <p className="text-2xl font-medium text-slate-900">
            {user.titel ? `${user.titel} ` : ""}
            {user.vorname} {user.nachname}
          </p>
          {user.rolle === "admin" && (
            <p className="text-sm text-muted-foreground mt-1">Administrator</p>
          )}
        </div>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <FileText className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{berichte.length}</p>
              <p className="text-sm text-muted-foreground">Gesamt Berichte</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50  rounded-full">
              <NotepadTextDashed className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {berichte.filter((b) => b.status === "entwurf").length}
              </p>
              <p className="text-sm text-muted-foreground">Entwürfe</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-full">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {berichte.filter((b) => b.status === "abgeschlossen").length}
              </p>
              <p className="text-sm text-muted-foreground">Abgeschlossen</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR: Suche links, Button rechts */}
      <div className="flex items-center justify-between gap-6 mb-4">
        <div className="w-[400px]">
          <Input
            type="text"
            placeholder="Suchen nach Lfd.Nr. oder Patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>

        <Link
          href="/formular"
          className="h-9 px-5 rounded-lg bg-black text-white text-sm font-medium hover:bg-slate-900 transition flex items-center"
        >
          + Neuer Bericht
        </Link>
      </div>

      {/* ALERT */}
      {alertMsg && (
        <div className="fixed top-24 right-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right">
          <div className="bg-red-100 p-1.5 rounded-full">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium">{alertMsg}</p>
          <button
            onClick={() => setAlertMsg(null)}
            className="text-red-400 hover:text-red-600"
            title="Schließen"
            aria-label="Schließen"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TABELLE */}
      <div className="border  rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b text-[11px] text-muted-foreground">
                <th className="px-6 py-3 font-medium">Lfd.Nr.</th>
                <th className="px-6 py-3 font-medium">Patient ID</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Unfalldatum</th>
                <th className="px-6 py-3 font-medium">Erstellt am</th>
                {user.rolle === "admin" && (
                  <th className="px-6 py-3 font-medium">Arzt ID</th>
                )}
                <th className="px-6 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>

            <tbody>
              {filteredBerichte.map((bericht) => (
                <tr
                  key={bericht.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {bericht.lfd_nr}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {bericht.patient_id}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={bericht.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(bericht.unfalltag).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(bericht.erstellt_am).toLocaleDateString("de-DE")}
                  </td>
                  {user.rolle === "admin" && (
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {bericht.benutzer_id}
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Play/Edit (nur bei Entwürfen) */}
                      {bericht.status !== "abgeschlossen" && (
                        <button
                          onClick={() =>
                            handleNavigationRequest(bericht.id, "edit")
                          }
                          className={actionBtn}
                          title="Bearbeiten"
                        >
                          <Play className="w-4 h-4 text-slate-700" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteRequest(bericht)}
                        className={actionBtnDanger}
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* View */}
                      <button
                        onClick={() =>
                          handleNavigationRequest(bericht.id, "view")
                        }
                        className={actionBtn}
                        title="Ansehen"
                      >
                        <FileText className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBerichte.length === 0 && (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full  mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-slate-900 font-medium text-lg mb-1">
              Keine Berichte gefunden
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Versuchen Sie einen anderen Suchbegriff."
                : "Erstellen Sie Ihren ersten Bericht."}
            </p>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Löschen Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Bericht löschen?
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  Möchten Sie diesen Bericht wirklich unwiderruflich löschen?
                  <br />
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, berichtId: null })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Abbrechen
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
              >
                Ja, löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Modal */}
      {navModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setNavModal({ ...navModal, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition"
              aria-label="Modales Fenster schließen"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 pt-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-800 mb-4">
                {navModal.type === "edit" ? (
                  <Play className="w-7 h-7 ml-1" />
                ) : (
                  <FileText className="w-7 h-7" />
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {navModal.type === "edit"
                  ? "Bericht weiterbearbeiten?"
                  : "Bericht anzeigen"}
              </h3>

              <p className="text-slate-600 text-sm mt-2 px-4">
                {navModal.type === "edit"
                  ? "Möchten Sie die Bearbeitung dieses Berichts fortsetzen?"
                  : "Sie öffnen den Bericht im Lesemodus. Änderungen sind hier nicht möglich."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNavModal({ ...navModal, isOpen: false })}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Abbrechen
              </button>

              <Link
                href={
                  navModal.type === "view"
                    ? `/berichte/${navModal.berichtId}`
                    : `/berichte/${navModal.berichtId}/edit`
                }
                className="px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-slate-900 transition shadow-sm flex items-center justify-center gap-2"
              >
                {navModal.type === "edit" ? "Fortsetzen" : "Anzeigen"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}