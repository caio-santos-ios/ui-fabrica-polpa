import { Metadata } from "next";
import ProductForm from "@/components/pages/produtos/ProductForm";

export const metadata: Metadata = { title: "Pulpa | Novo Produto" };

export default function NovoProdutoPage() {
  return <ProductForm />;
}
