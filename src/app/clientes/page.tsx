import { Metadata } from "next";
import CustomerTable from "@/components/pages/clientes/CustomerTable";

export const metadata: Metadata = { title: "Pulpa | Clientes" };

export default function ClientesPage() {
  return <CustomerTable />;
}
