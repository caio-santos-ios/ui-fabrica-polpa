import { atom } from "jotai";
import { TPagination } from "@/types/global/pagination.type";

export const loadingAtom = atom<boolean>(false);

export const paginationAtom = atom<TPagination>({
  data: [],
  totalPages: 1,
  totalCount: 0,
  currentPage: 1,
  sizePage: 10,
});

export const modalAtom = atom<boolean>(false);
