"use client";

import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";

type TBatchForm = {
  productId: string; supplierId: string; batchCode: string;
  quantity: number; expiryDate: string; costPrice: number; notes: string;
};

export default function StockBatchForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TBatchForm>();
  const [, setLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const onSubmit = async (formData: TBatchForm) => {
    try {
      setLoading(true);
      await api.post("/stock/batches", {
        ...formData,
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
      }, configApi());
      resolveResponse({ status: 201, message: "Lote registrado com sucesso" });
      router.push("/estoque/lotes");
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/estoque/lotes" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
          <FiArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Novo Lote de Estoque</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ID do Produto *</label>
            <input {...register("productId", { required: "Obrigatório" })} className="input-erp-primary input-erp-default w-full" placeholder="ObjectId do produto" />
            {errors.productId && <p className="text-xs text-error-500 mt-1">{errors.productId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Código do Lote *</label>
            <input {...register("batchCode", { required: "Obrigatório" })} className="input-erp-primary input-erp-default w-full" placeholder="Ex: LOT-2024-001" />
            {errors.batchCode && <p className="text-xs text-error-500 mt-1">{errors.batchCode.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantidade *</label>
            <input type="number" {...register("quantity", { required: "Obrigatório", valueAsNumber: true, min: 1 })} className="input-erp-primary input-erp-default w-full" />
            {errors.quantity && <p className="text-xs text-error-500 mt-1">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Validade *</label>
            <input type="date" {...register("expiryDate", { required: "Obrigatório" })} className="input-erp-primary input-erp-default w-full" />
            {errors.expiryDate && <p className="text-xs text-error-500 mt-1">{errors.expiryDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preço de Custo (R$) *</label>
            <input type="number" step="0.01" {...register("costPrice", { required: "Obrigatório", valueAsNumber: true, min: 0 })} className="input-erp-primary input-erp-default w-full" placeholder="0,00" />
            {errors.costPrice && <p className="text-xs text-error-500 mt-1">{errors.costPrice.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ID do Fornecedor</label>
            <input {...register("supplierId")} className="input-erp-primary input-erp-default w-full" placeholder="ObjectId do fornecedor" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Observações</label>
            <textarea {...register("notes")} rows={2} className="input-erp-primary input-erp-default w-full resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50 w-auto px-6 gap-2">
            <FiSave size={16} />
            {isSubmitting ? "Salvando..." : "Registrar Lote"}
          </button>
          <Link href="/estoque/lotes" className="btn-erp-primary bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-auto px-6">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
