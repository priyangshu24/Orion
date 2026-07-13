import { create } from "zustand";
import { intelDocuments } from "../constants/data";
import { mockChunks } from "../constants/chunks";
import type { DocChunk, IntelDocument } from "../types";

interface IntelligenceState {
  documents: IntelDocument[];
  chunks: Record<string, DocChunk[]>;
  addDocument: (doc: IntelDocument) => void;
  updateDocument: (id: string, patch: Partial<IntelDocument>) => void;
  setChunks: (documentId: string, chunks: DocChunk[]) => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  documents: intelDocuments,
  chunks: mockChunks,
  addDocument: (doc) =>
    set((s) => ({ documents: [doc, ...s.documents] })),
  updateDocument: (id, patch) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  setChunks: (documentId, chunks) =>
    set((s) => ({ chunks: { ...s.chunks, [documentId]: chunks } })),
}));
