import { Metadata } from "next";
import SupplierTable from "@/components/pages/clientes/SupplierTable";

export const metadata: Metadata = { title: "Pulpa | Fornecedores" };

export default function FornecedoresPage() {
  return <SupplierTable />;
}
