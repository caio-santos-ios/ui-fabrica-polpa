import { Metadata } from "next";
import StockAlerts from "@/components/pages/estoque/StockAlerts";

export const metadata: Metadata = { title: "Pulpa | Alertas de Estoque" };

export default function AlertasPage() {
  return <StockAlerts />;
}
