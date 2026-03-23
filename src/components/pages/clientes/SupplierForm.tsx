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

type TSupplierForm = {
  name: string; cnpj: string; contactName: string;
  phone: string; email: string;
  street: string; number: string; city: string; state: string; zipCode: string;
};

export default function SupplierForm({ id }: { id?: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TSupplierForm>();
  const [, setLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const isEdit = !!id;

  useEffect(() => { if (isEdit) loadSupplier(); }, [id]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/suppliers/${id}`, configApi());
      const s = (data as any).result?.data;
      if (s) reset({ ...s, street: s.address?.street, number: s.address?.number, city: s.address?.city, state: s.address?.state, zipCode: s.address?.zipCode });
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  const onSubmit = async (formData: TSupplierForm) => {
    try {
      setLoading(true);
      const payload = {
        name: formData.name, cnpj: formData.cnpj, contactName: formData.contactName,
        phone: formData.phone, email: formData.email,
        address: { street: formData.street, number: formData.number, city: formData.city, state: formData.state, zipCode: formData.zipCode },
      };
      if (isEdit) {
        await api.put("/suppliers", { ...payload, id }, configApi());
        resolveResponse({ status: 201, message: "Fornecedor atualizado com sucesso" });
      } else {
        await api.post("/suppliers", payload, configApi());
        resolveResponse({ status: 201, message: "Fornecedor criado com sucesso" });
      }
      router.push("/fornecedores");
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/fornecedores" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
          <FiArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome *</label>
            <input {...register("name", { required: "Obrigatório" })} className="input-erp-primary input-erp-default w-full" />
            {errors.name && <p className="text-xs text-error-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CNPJ</label>
            <input {...register("cnpj")} className="input-erp-primary input-erp-default w-full" placeholder="00.000.000/0001-00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Responsável</label>
            <input {...register("contactName")} className="input-erp-primary input-erp-default w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefone</label>
            <input {...register("phone")} className="input-erp-primary input-erp-default w-full" placeholder="(00) 00000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
            <input type="email" {...register("email")} className="input-erp-primary input-erp-default w-full" />
          </div>

          <p className="sm:col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">Endereço</p>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rua</label>
            <input {...register("street")} className="input-erp-primary input-erp-default w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Número</label>
            <input {...register("number")} className="input-erp-primary input-erp-default w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CEP</label>
            <input {...register("zipCode")} className="input-erp-primary input-erp-default w-full" placeholder="00000-000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cidade</label>
            <input {...register("city")} className="input-erp-primary input-erp-default w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
            <input {...register("state")} className="input-erp-primary input-erp-default w-full" placeholder="BA" maxLength={2} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50 w-auto px-6 gap-2">
            <FiSave size={16} />{isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <Link href="/fornecedores" className="btn-erp-primary bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-auto px-6">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
