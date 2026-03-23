import { atom } from "jotai";
import { TProduct, ResetProduct } from "@/types/domain.type";

export const productModalCreateAtom = atom<boolean>(false);
export const productIdModalAtom = atom<string>("");
export const productAtom = atom<TProduct>(ResetProduct);
export const productNewAtom = atom<boolean>(false);
