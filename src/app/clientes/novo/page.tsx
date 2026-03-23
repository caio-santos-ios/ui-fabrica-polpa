import { Metadata } from "next";
import CustomerForm from "@/components/pages/clientes/CustomerForm";

export const metadata: Metadata = { title: "Pulpa | Novo Cliente" };

export default function NovoClientePage() {
  return <CustomerForm />;
}
