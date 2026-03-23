import { NavItem } from "@/types/global/menu.type";
import { atom } from "jotai";

export const menuRoutinesAtom = atom<NavItem[]>([
  {
    name: "PDV",
    icon: "FiShoppingCart",
    path: "/pdv",
    code: "PDV",
    authorized: true,
  },
  {
    name: "Estoque",
    icon: "FiPackage",
    code: "STOCK",
    authorized: true,
    subItems: [
      { name: "Lotes", path: "/estoque/lotes", code: "STOCK_BATCHES", authorized: true },
      { name: "Alertas", path: "/estoque/alertas", code: "STOCK_ALERTS", authorized: true },
    ],
  },
  {
    name: "Produtos",
    icon: "FiBox",
    path: "/produtos",
    code: "PRODUCTS",
    authorized: true,
  },
  {
    name: "Clientes",
    icon: "FiUsers",
    path: "/clientes",
    code: "CUSTOMERS",
    authorized: true,
  },
  {
    name: "Fornecedores",
    icon: "FiTruck",
    path: "/fornecedores",
    code: "SUPPLIERS",
    authorized: true,
  },
  {
    name: "Relatórios",
    icon: "FiBarChart2",
    code: "REPORTS",
    authorized: true,
    subItems: [
      { name: "Vendas", path: "/relatorios/vendas", code: "REPORT_SALES", authorized: true },
      { name: "Lucro por produto", path: "/relatorios/lucro", code: "REPORT_PROFIT", authorized: true },
      { name: "Perdas", path: "/relatorios/perdas", code: "REPORT_LOSSES", authorized: true },
    ],
  },
]);
