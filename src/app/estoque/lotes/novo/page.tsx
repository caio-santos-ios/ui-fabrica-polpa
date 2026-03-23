import { Metadata } from "next";
import StockBatchForm from "@/components/pages/estoque/StockBatchForm";

export const metadata: Metadata = { title: "Pulpa | Novo Lote" };

export default function NovoLotePage() {
  return <StockBatchForm />;
}
