"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import Link from "next/link";

type TSignUp = { name: string; email: string; phone: string; password: string; confirmPassword: string; privacyPolicy: boolean };

export default function SignUpForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TSignUp>();
  const router = useRouter();

  const onSubmit = async (data: TSignUp) => {
    try {
      await api.post("/auth/register", {
        name: data.name, email: data.email, phone: data.phone,
        password: data.password, privacyPolicy: data.privacyPolicy,
      });
      toast.success("Conta criada! Verifique seu e-mail.", { theme: "colored" });
      router.push("/confirm-account");
    } catch (error: any) {
      const msg = error?.response?.data?.result?.message ?? "Falha ao criar conta.";
      toast.warn(msg, { theme: "colored" });
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar conta</h1>
        <p className="text-sm text-gray-500 mt-1">Pulpa — Fábrica de Polpas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input {...register("name", { required: "Nome obrigatório" })} placeholder="Seu nome" className="input-erp-primary input-erp-default pl-10" />
          </div>
          {errors.name && <p className="text-xs text-error-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" {...register("email", { required: "E-mail obrigatório" })} placeholder="seu@email.com" className="input-erp-primary input-erp-default pl-10" />
          </div>
          {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Celular</label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input {...register("phone")} placeholder="(00) 00000-0000" className="input-erp-primary input-erp-default pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="password" {...register("password", { required: "Senha obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} placeholder="••••••••" className="input-erp-primary input-erp-default pl-10" />
          </div>
          {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input type="checkbox" id="privacy" {...register("privacyPolicy", { required: "Obrigatório" })} className="mt-0.5" />
          <label htmlFor="privacy" className="text-xs text-gray-600 dark:text-gray-400">
            Aceito os <span className="text-brand-500">Termos de Uso</span> e a <span className="text-brand-500">Política de Privacidade</span>
          </label>
        </div>
        {errors.privacyPolicy && <p className="text-xs text-error-500">{errors.privacyPolicy.message}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50 mt-2">
          {isSubmitting ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem conta?{" "}
        <Link href="/" className="text-brand-500 hover:underline font-medium">Entrar</Link>
      </p>
    </div>
  );
}
