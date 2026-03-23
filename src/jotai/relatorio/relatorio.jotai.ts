import { atom } from "jotai";

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

export const reportFromAtom = atom<string>(firstOfMonth.toISOString().split("T")[0]);
export const reportToAtom = atom<string>(today.toISOString().split("T")[0]);
export const reportTabAtom = atom<"sales" | "profit" | "losses">("sales");
