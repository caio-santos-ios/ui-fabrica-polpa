"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";

type TProductForm = {
  name: string; description: string; category: string;
  weightGrams: number; costPrice: number; salePrice: number;
  minStockLevel: number; supplierId: string; imageUrl: string; active: boolean;
};

export default function ProductForm({ id }: { id?: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TProductForm>({
    defaultValues: { category: "TropicalFruits", weightGrams: 500, minStockLevel: 10, active: true },
  });
  const [, setLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`, configApi());
      const p = (data as any).result?.data;
      if (p) reset(p);
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  const onSubmit = async (formData: TProductForm) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.put("/products", { ...formData, id }, configApi());
        resolveResponse({ status: 201, message: "Produto atualizado com sucesso" });
      } else {
        await api.post("/products", formData, configApi());
        resolveResponse({ status: 201, message: "Produto criado com sucesso" });
      }
      router.push("/produtos");
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/produtos" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
          <FiArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome *</label>
            <input {...register("name", { required: "Nome obrigatório" })} className="input-erp-primary input-erp-default w-full" placeholder="Ex: Polpa de Açaí" />
            {errors.name && <p className="text-xs text-error-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
            <textarea {...register("description")} rows={2} className="input-erp-primary input-erp-default w-full resize-none" placeholder="Descrição do produto..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria *</label>
            <select {...register("category", { required: true })} className="input-erp-primary input-erp-default w-full">
              <option value="TropicalFruits">Frutas Tropicais</option>
              <option value="ExoticFruits">Frutas Exóticas</option>
              <option value="Mix">Mix</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Variação de Peso (g) *</label>
            <select {...register("weightGrams", { required: true, valueAsNumber: true })} className="input-erp-primary input-erp-default w-full">
              <option value={100}>100g</option>
              <option value={500}>500g</option>
              <option value={1000}>1kg</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço de Custo (R$) *</label>
            <input type="number" step="0.01" {...register("costPrice", { required: "Obrigatório", valueAsNumber: true, min: 0 })} className="input-erp-primary input-erp-default w-full" placeholder="0,00" />
            {errors.costPrice && <p className="text-xs text-error-500 mt-1">{errors.costPrice.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço de Venda (R$) *</label>
            <input type="number" step="0.01" {...register("salePrice", { required: "Obrigatório", valueAsNumber: true, min: 0 })} className="input-erp-primary input-erp-default w-full" placeholder="0,00" />
            {errors.salePrice && <p className="text-xs text-error-500 mt-1">{errors.salePrice.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estoque Mínimo</label>
            <input type="number" {...register("minStockLevel", { valueAsNumber: true, min: 0 })} className="input-erp-primary input-erp-default w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL da Imagem</label>
            <input {...register("imageUrl")} className="input-erp-primary input-erp-default w-full" placeholder="https://..." />
          </div>

          {isEdit && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="active" {...register("active")} className="w-4 h-4 accent-brand-500" />
              <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">Produto ativo</label>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50 w-auto px-6 gap-2">
            <FiSave size={16} />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <Link href="/produtos" className="btn-erp-primary bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-auto px-6">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
