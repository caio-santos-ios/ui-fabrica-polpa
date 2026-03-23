// ─── auth/auth.jotai.ts ──────────────────────────────────────────────────────
import { atom } from "jotai";
import { TUserLogged, ResetUserLogged } from "@/types/user/user.type";

export const userLoggerAtom = atom<TUserLogged>(ResetUserLogged);
export const syncAtom = atom<boolean>(false);
export const userAdmin = atom<boolean>(false);
export const modal403Atom = atom<boolean>(false);
