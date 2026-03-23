import { Metadata } from "next";
import SupplierForm from "@/components/pages/clientes/SupplierForm";

export const metadata: Metadata = { title: "Pulpa | Editar Fornecedor" };

export default function EditarFornecedorPage({ params }: { params: { id: string } }) {
  return <SupplierForm id={params.id} />;
}
