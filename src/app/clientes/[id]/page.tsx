import { Metadata } from "next";
import CustomerForm from "@/components/pages/clientes/CustomerForm";

export const metadata: Metadata = { title: "Pulpa | Editar Cliente" };

export default function EditarClientePage({ params }: { params: { id: string } }) {
  return <CustomerForm id={params.id} />;
}
