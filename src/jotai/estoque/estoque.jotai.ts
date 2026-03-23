import { atom } from "jotai";
import { TStockBatch, ResetStockBatch, TStockAlert } from "@/types/domain.type";

export const stockBatchModalCreateAtom = atom<boolean>(false);
export const stockBatchIdModalAtom = atom<string>("");
export const stockBatchAtom = atom<TStockBatch>(ResetStockBatch);
export const stockAlertsAtom = atom<TStockAlert[]>([]);
