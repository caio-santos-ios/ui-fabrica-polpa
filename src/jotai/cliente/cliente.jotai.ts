import { atom } from "jotai";
import { TCustomer, ResetCustomer, TSupplier, ResetSupplier } from "@/types/domain.type";

export const customerModalCreateAtom = atom<boolean>(false);
export const customerIdModalAtom = atom<string>("");
export const customerAtom = atom<TCustomer>(ResetCustomer);
export const customerNewAtom = atom<boolean>(false);
