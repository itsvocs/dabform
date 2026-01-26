"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FileText as FileTextIcon,
  Search,
  Trash2 as Trash2Icon,
  FileText,
  Archive,
  FileCheck2Icon,
  FilePen,
  Download,
} from "lucide-react";

import type { User, Bericht } from "@/types";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  berichteToCsvAllFields,
  downloadTextFile,
  // parseCsvAll,
  // csvRowToBerichtPatch,
} from "@/lib/csv";
// import { useRef } from "react";

import { Spinner } from "@/components/ui/spinner";
import { Menu, MenuItem, MenuPopup, MenuSub, MenuSubPopup, MenuSubTrigger, MenuTrigger } from "@/components/ui/menu";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogClose, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { berichteApi, pdfApi } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";

interface DashboardClientProps {
  user: User;
  initialBerichte: Bericht[];
}

type BerichtStatus = "entwurf" | "abgeschlossen";
type BerichtType = "kk" | "uv"

export default function DashboardClient({
  user,
  initialBerichte,
}: DashboardClientProps) {

  const [berichte, setBerichte] = useState<Bericht[]>(initialBerichte);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter()

  // Modals
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    berichtId: number | null;
  }>({ isOpen: false, berichtId: null });

  // Optional: Spinner-Status pro Aktion (nur UI, keine Backend Änderung)
  const [pendingAction, setPendingAction] = useState<{
    id: number;
    type: "edit" | "view" | "delete";
  } | null>(null);

  const isActionPending = (id: number, type: "edit" | "view" | "delete") =>
    pendingAction?.id === id && pendingAction.type === type;

  const isBusy = (id: number) => pendingAction?.id === id;

  // Archivierungsfrist prüfen (30 Jahre)
  const isOlderThan30Years = (dateString: string) => {
    const accidentDate = new Date(dateString);
    const today = new Date();
    const cutoffDate = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate()
    );
    return accidentDate < cutoffDate;
  };

  const filteredBerichte = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return berichte;

    return berichte.filter(
      (b) =>
        (b.lfd_nr ?? "").toLowerCase().includes(q) ||
        b.patient_id.toString().includes(q)
    );
  }, [berichte, searchTerm]);


  function getStatusBadge(status: BerichtStatus) {
    switch (status) {
      case "entwurf":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 border-0 p-2"
          >
            Entwurf
          </Badge>
        );
      case "abgeschlossen":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 border-0 p-2"
          >
            Abgeschlossen
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  const deleteBericht = async (bericht: Bericht) => {
    // prüfen den Status 
    const berichtId = bericht.id;
    const status = bericht.status
    setPendingAction({ id: berichtId, type: "delete" });
    try {

      if (status === "abgeschlossen") {
        if (isOlderThan30Years(bericht.unfalltag)) {
          await berichteApi.delete(berichtId)
          router.refresh()
          toastManager.add({
            type: "success",
            title: "Gelöscht",
            description: "Der Bericht wurde erfolgreich gelöscht."
          })

        } else {
          toastManager.add({
            type: "warning",
            title: "Löschen nicht möglich",
            description:
              "Archivierungsfrist von 10 Jahren ist noch nicht abgelaufen.",
          });

          return;
        }
      } else {
        await berichteApi.delete(berichtId)
        toastManager.add({
          type: "success",
          title: "Gelöscht",
          description: "Der Bericht wurde erfolgreich gelöscht."
        })
        router.refresh()
      }
    } catch {
      toastManager.add({
        type: "error",
        title: "Fehler beim Löschen",
        description: "Netzwerkfehler oder Server nicht erreichbar.",
      });
    } finally {
      setPendingAction(null);
    }

  }

  const downloadBericht = async ({ id, type }: { id: number; type: BerichtType }) => {
    try {
      if (type === "kk") {
        await pdfApi.downloadAndSave(id, type);
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Bericht für die Krankenkasse erfolgreich heruntergeladen !"
        })
      } else {
        await pdfApi.downloadAndSave(id, type);
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Bericht für die UV-Träger erfolgreich heruntergeladen !"
        })
      }
    } catch {
      toastManager.add({
        type: "error",
        title: "Fehler",
        description: "Netzwerkfehler oder Server nicht erreichbar."
      })
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <p className="text-2xl text-muted-foreground">Willkommen zurück,</p>
          <p className="text-2xl font-semibold">
            {user.titel ? `${user.titel} ` : ""}
            {user.vorname} {user.nachname}
          </p>
          {user.rolle === "admin" && (
            <p className="text-sm text-muted-foreground mt-1">Administrator</p>
          )}
        </div>
      </div>

      {/* Statistiken (bleibt wie bei dir, nur leicht konsistent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 rounded-full">
              <FileText className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{berichte.length}</p>
              <p className="text-sm text-muted-foreground">Gesamt Berichte</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-full">
              <Archive className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {berichte.filter((b) => b.status === "entwurf").length}
              </p>
              <p className="text-sm text-muted-foreground">Entwürfe</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-full">
              <FileCheck2Icon className="h-5 w-5 text-green-600" />
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

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-6 mb-4">
        <div className="w-[420px]">
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

      {/* Tabelle (shadcn) */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="h-12 px-4 font-medium">Lfd.Nr.</TableHead>
              <TableHead className="h-12 px-4 font-medium">Patienten ID</TableHead>
              <TableHead className="h-12 px-4 font-medium w-[140px]">
                Status
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">Unfalldatum</TableHead>
              <TableHead className="h-12 px-4 font-medium">Erstellt am</TableHead>
              {user.rolle === "admin" && (
                <TableHead className="h-12 px-4 font-medium">Arzt ID</TableHead>
              )}
              <TableHead className="h-12 px-4 font-medium w-[180px] text-right">
                Aktionen
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBerichte.map((bericht) => {
              const busy = isBusy(bericht.id);
              const deletePending = isActionPending(bericht.id, "delete");

              return (
                <TableRow key={bericht.id} className="hover:bg-muted/50">
                  <TableCell className="h-16 px-4 font-medium">
                    {bericht.lfd_nr}
                  </TableCell>

                  <TableCell className="h-16 px-4 text-sm text-muted-foreground">
                    {bericht.patient_id}
                  </TableCell>

                  <TableCell className="h-16 px-4">
                    {getStatusBadge(bericht.status)}
                  </TableCell>

                  <TableCell className="h-16 px-4 text-sm text-muted-foreground">
                    {new Date(bericht.unfalltag).toLocaleDateString("de-DE")}
                  </TableCell>

                  <TableCell className="h-16 px-4 text-sm text-muted-foreground">
                    {new Date(bericht.erstellt_am).toLocaleDateString("de-DE")}
                  </TableCell>

                  {user.rolle === "admin" && (
                    <TableCell className="h-16 px-4 text-sm text-muted-foreground">
                      {bericht.benutzer_id}
                    </TableCell>
                  )}

                  <TableCell className="h-16 px-4 flex gap-1 items-center justify-end">
                    <TooltipProvider delay={50}>
                      <div className="flex items-center justify-end gap-1">
                        {bericht.status !== "abgeschlossen" && (
                          <Tooltip>
                            <TooltipTrigger render={<Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                router.push(`/formular?id=${bericht.id}`)
                              }
                              disabled={busy}
                            />}>
                              <FilePen className="size-4" />
                            </TooltipTrigger>
                            <TooltipPopup>Bearbeiten</TooltipPopup>
                          </Tooltip>
                        )}


                        {/* View */}
                        {
                          bericht.status === "abgeschlossen" &&
                          <Tooltip>
                            <TooltipTrigger render={<Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                router.push(`/api/berichte/${bericht.id}/pdf/preview`)
                              }
                              disabled={busy}
                            />}>
                              <FileTextIcon className="size-4" />
                            </TooltipTrigger>
                            <TooltipContent>Ansehen</TooltipContent>
                          </Tooltip>
                        }

                        {/* Download */}

                      </div>
                    </TooltipProvider>
                    {
                      bericht.status === "abgeschlossen" &&
                      <Menu>
                        <MenuTrigger render={<Button variant="outline" size="icon" />}>
                          <Download className="size-4" />
                        </MenuTrigger>
                        <MenuPopup>
                          <MenuItem
                            onClick={() => {
                              const csv = berichteToCsvAllFields([bericht]);
                              downloadTextFile(
                                `${bericht.lfd_nr || "bericht"}-${bericht.id}.csv`,
                                csv,
                                "text/csv;charset=utf-8;"
                              );
                            }}
                          >
                            Als CSV
                          </MenuItem>
                          <MenuSub>
                            <MenuSubTrigger>Als PDF</MenuSubTrigger>
                            <MenuSubPopup>
                              <MenuItem onClick={() => downloadBericht({ id: bericht.id, type: "kk" })}>
                                Für die Krankenkasse
                              </MenuItem>
                              <MenuItem onClick={() => downloadBericht({ id: bericht.id, type: "uv" })}>
                                Für die UV-Träger
                              </MenuItem>
                            </MenuSubPopup>
                          </MenuSub>
                        </MenuPopup>
                      </Menu>
                    }

                    {/* Delete */}

                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="destructive-outline" size="icon" />}>
                        {deletePending ? (
                          <Spinner />
                        ) : (
                          <Trash2Icon />
                        )}
                      </AlertDialogTrigger>
                      <AlertDialogPopup>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bericht löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie diesen Bericht wirklich unwiderruflich löschen? Diese Aktion ist unwiderruflich, gehen Sie damit vorsicht vor.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogClose render={<Button variant="ghost" />}>
                            Abbrechen
                          </AlertDialogClose>
                          <AlertDialogClose render={<Button variant="destructive" onClick={() => deleteBericht(bericht)} />}>
                            Ja, löschen
                          </AlertDialogClose>
                        </AlertDialogFooter>
                      </AlertDialogPopup>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Empty State */}
        {filteredBerichte.length === 0 && (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-muted-foreground font-medium text-lg mb-1">
              Keine Berichte gefunden
            </h3>
            <p className="text-foreground">
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
        <>
          <AlertDialog>
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle> Bericht löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie diesen Bericht wirklich unwiderruflich löschen?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>
                  Abbrechen
                </AlertDialogClose>
                <AlertDialogClose render={<Button variant="destructive" onClick={() => setDeleteModal({ isOpen: false, berichtId: null })} />}>
                  Ja, löschen
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
