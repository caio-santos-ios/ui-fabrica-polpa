import { Metadata } from "next";
import ReportSales from "@/components/pages/relatorios/ReportSales";

export const metadata: Metadata = { title: "Pulpa | Relatório de Vendas" };

export default function RelatorioVendasPage() {
  return <ReportSales />;
}
