import { Metadata } from "next";
import ReportProfit from "@/components/pages/relatorios/ReportProfit";

export const metadata: Metadata = { title: "Pulpa | Lucro por Produto" };

export default function RelatorioProfitPage() {
  return <ReportProfit />;
}
