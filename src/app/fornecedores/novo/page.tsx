import { Metadata } from "next";
import SupplierForm from "@/components/pages/clientes/SupplierForm";

export const metadata: Metadata = { title: "Pulpa | Novo Fornecedor" };

export default function NovoFornecedorPage() {
  return <SupplierForm />;
}
