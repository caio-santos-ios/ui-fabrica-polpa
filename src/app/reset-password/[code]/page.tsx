"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";

type TResetForm = { password: string; newPassword: string; confirmPassword: string };

export default function ResetPasswordCodePage({ params }: { params: { code: string } }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TResetForm>();
  const router = useRouter();

  const onSubmit = async (data: TResetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.warn("As senhas não coincidem.", { theme: "colored" });
      return;
    }
    try {
      await api.put("/auth/reset-forgot-password", { codeAccess: params.code, password: data.newPassword, newPassword: data.newPassword });
      toast.success("Senha redefinida com sucesso!", { theme: "colored" });
      router.push("/");
    } catch (error: any) {
      toast.warn(error?.response?.data?.result?.message ?? "Falha ao redefinir senha.", { theme: "colored" });
    }
  };

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nova senha</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "newPassword" as const, label: "Nova senha" },
            { name: "confirmPassword" as const, label: "Confirmar senha" },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" {...register(field.name, { required: "Obrigatório", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} className="input-erp-primary input-erp-default pl-10 w-full" placeholder="••••••••" />
              </div>
              {errors[field.name] && <p className="text-xs text-error-500 mt-1">{errors[field.name]?.message}</p>}
            </div>
          ))}
          <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50">
            {isSubmitting ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
