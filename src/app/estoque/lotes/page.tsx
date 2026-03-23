import { Metadata } from "next";
import EstoqueContent from "@/components/pages/estoque/EstoqueContent";

export const metadata: Metadata = { title: "Pulpa | Estoque" };

export default function EstoquePage() {
  return <EstoqueContent />;
}
