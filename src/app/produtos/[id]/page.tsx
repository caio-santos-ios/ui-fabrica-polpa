import { Metadata } from "next";
import ProductForm from "@/components/pages/produtos/ProductForm";

export const metadata: Metadata = { title: "Pulpa | Editar Produto" };

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  return <ProductForm id={params.id} />;
}
