import { Metadata } from "next";
import ProductTable from "@/components/pages/produtos/ProductTable";

export const metadata: Metadata = { title: "Pulpa | Produtos" };

export default function ProdutosPage() {
  return <ProductTable />;
}
