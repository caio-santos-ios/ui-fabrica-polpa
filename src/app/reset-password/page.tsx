"use client";

import { useForm } from "react-hook-form";
import { api } from "@/service/api.service";
import { toast } from "react-toastify";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      await api.put("/auth/request-forgot-password", { email: data.email });
      toast.success("E-mail de redefinição enviado!", { theme: "colored" });
    } catch (error: any) {
      toast.warn(error?.response?.data?.result?.message ?? "Falha ao enviar e-mail.", { theme: "colored" });
    }
  };

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600"><FiArrowLeft size={20} /></Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Esqueci a senha</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="email" {...register("email", { required: true })} className="input-erp-primary input-erp-default pl-10 w-full" placeholder="seu@email.com" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50">
            {isSubmitting ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>
      </div>
    </div>
  );
}
