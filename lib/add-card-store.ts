import { create } from "zustand";

/**
 * Draft for the Add Card flow, shared across the scan → search → confirm →
 * added steps (images can't ride in route params, so they live here).
 */
export type AddSource = "camera" | "search" | null;

export type AddCardDraft = {
  source: AddSource;
  frontUri: string | null; // user's own photo
  backUri: string | null;
  referenceAccent: string | null; // gradient color for the search reference photo
  name: string;
  genre: string;
  condition: string;
  cardType: string;
  visibility: "private" | "showcased" | "listed";
  graded: boolean;
  gradingCompany: string;
  grade: string;
  notes: string;
};

type Store = AddCardDraft & {
  patch: (p: Partial<AddCardDraft>) => void;
  reset: () => void;
};

const INITIAL: AddCardDraft = {
  source: null,
  frontUri: null,
  backUri: null,
  referenceAccent: null,
  name: "",
  genre: "Pokémon",
  condition: "Near Mint",
  cardType: "Normal",
  visibility: "private",
  graded: false,
  gradingCompany: "PSA",
  grade: "9",
  notes: "",
};

export const useAddCardDraft = create<Store>((set) => ({
  ...INITIAL,
  patch: (p) => set(p),
  reset: () => set(INITIAL),
}));
