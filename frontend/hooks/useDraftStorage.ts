// app/formular/hooks/useDraftStorage.ts
'use client';

import { FormularDraft,FormularData, defaultFormularData } from '@/types/formular';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'dab-form-drafts';
const CURRENT_DRAFT_KEY = 'dab-form-current-draft';

export function useDraftStorage() {
  const [currentDraft, setCurrentDraft] = useState<FormularDraft | null>(null);
  const [allDrafts, setAllDrafts] = useState<FormularDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Alle Entwürfe laden
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAllDrafts(JSON.parse(stored));
      } catch {
        setAllDrafts([]);
      }
    }

    const currentId = localStorage.getItem(CURRENT_DRAFT_KEY);
    if (currentId && stored) {
      const drafts = JSON.parse(stored) as FormularDraft[];
      const draft = drafts.find(d => d.id === currentId);
      if (draft) {
        setCurrentDraft(draft);
      }
    }

    setIsLoading(false);
  }, []);

  // Neuen Entwurf erstellen
  const createNewDraft = useCallback((): FormularDraft => {
    const newDraft: FormularDraft = {
      id: `draft-${Date.now()}`,
      currentStep: 1,
      lastSaved: new Date().toISOString(),
      data: { ...defaultFormularData },
    };

    const updatedDrafts = [...allDrafts, newDraft];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
    localStorage.setItem(CURRENT_DRAFT_KEY, newDraft.id!);
    
    setAllDrafts(updatedDrafts);
    setCurrentDraft(newDraft);

    return newDraft;
  }, [allDrafts]);

  // Entwurf speichern
  const saveDraft = useCallback((data: Partial<FormularData>, step?: number) => {
    if (!currentDraft) return;

    const updatedDraft: FormularDraft = {
      ...currentDraft,
      currentStep: step ?? currentDraft.currentStep,
      lastSaved: new Date().toISOString(),
      data: { ...currentDraft.data, ...data },
    };

    const updatedDrafts = allDrafts.map(d => 
      d.id === currentDraft.id ? updatedDraft : d
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
    setAllDrafts(updatedDrafts);
    setCurrentDraft(updatedDraft);
  }, [currentDraft, allDrafts]);

  // Backend-ID setzen (nach erstem Speichern)
  const setBerichtId = useCallback((berichtId: number) => {
    if (!currentDraft) return;

    const updatedDraft: FormularDraft = {
      ...currentDraft,
      berichtId,
      lastSaved: new Date().toISOString(),
    };

    const updatedDrafts = allDrafts.map(d => 
      d.id === currentDraft.id ? updatedDraft : d
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
    setAllDrafts(updatedDrafts);
    setCurrentDraft(updatedDraft);
  }, [currentDraft, allDrafts]);

  // Entwurf laden
  const loadDraft = useCallback((draftId: string) => {
    const draft = allDrafts.find(d => d.id === draftId);
    if (draft) {
      localStorage.setItem(CURRENT_DRAFT_KEY, draftId);
      setCurrentDraft(draft);
    }
  }, [allDrafts]);

  // Entwurf löschen
  const deleteDraft = useCallback((draftId: string) => {
    const updatedDrafts = allDrafts.filter(d => d.id !== draftId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
    setAllDrafts(updatedDrafts);

    if (currentDraft?.id === draftId) {
      localStorage.removeItem(CURRENT_DRAFT_KEY);
      setCurrentDraft(null);
    }
  }, [allDrafts, currentDraft]);

  // Entwurf nach Abschluss entfernen
  const completeDraft = useCallback(() => {
    if (currentDraft?.id) {
      deleteDraft(currentDraft.id);
    }
  }, [currentDraft, deleteDraft]);

  return {
    currentDraft,
    allDrafts,
    isLoading,
    createNewDraft,
    saveDraft,
    setBerichtId,
    loadDraft,
    deleteDraft,
    completeDraft,
  };
}