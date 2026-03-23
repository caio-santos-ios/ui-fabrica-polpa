import { Metadata } from "next";
import ReportLosses from "@/components/pages/relatorios/ReportLosses";

export const metadata: Metadata = { title: "Pulpa | Perdas de Estoque" };

export default function RelatorioPerdasPage() {
  return <ReportLosses />;
}
