import { atom } from "jotai";
import { TSupplier, ResetSupplier } from "@/types/domain.type";

export const supplierModalCreateAtom = atom<boolean>(false);
export const supplierIdModalAtom = atom<string>("");
export const supplierAtom = atom<TSupplier>(ResetSupplier);
