import { atom } from "jotai";
import { TCart, ResetCart, TSale } from "@/types/domain.type";

export const cartAtom = atom<TCart>(ResetCart);
export const pdvModeAtom = atom<"cart" | "payment" | "success">("cart");
export const activeSaleAtom = atom<TSale | null>(null);

export const cartSubtotalAtom = atom((get) =>
  get(cartAtom).items.reduce((sum, item) => sum + item.subtotal, 0)
);

export const cartAmountPaidAtom = atom((get) =>
  get(cartAtom).payments.reduce((sum, p) => sum + p.amount, 0)
);

export const cartChangeAtom = atom((get) => {
  const cart = get(cartAtom);
  const paid = cart.payments.reduce((sum, p) => sum + p.amount, 0);
  return paid - cart.total;
});

export const canFinalizeSaleAtom = atom((get) => {
  const cart = get(cartAtom);
  if (cart.items.length === 0) return false;
  const paid = cart.payments.reduce((sum, p) => sum + p.amount, 0);
  return paid >= cart.total;
});
