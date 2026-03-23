"use client";

import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { saveLocalStorage } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

type TSignIn = { email: string; password: string };

export default function SignInForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TSignIn>();
  const [, setLoading] = useAtom(loadingAtom);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: TSignIn) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email: data.email, password: data.password });
      const result = (res.data as any).result?.data;

      saveLocalStorage({
        token: result.token,
        refreshToken: result.refreshToken,
        name: result.name,
        email: result.email,
        admin: result.admin,
        photo: result.photo,
        logoCompany: result.logoCompany ?? "",
        nameCompany: result.nameCompany ?? "",
        nameStore: result.nameStore ?? "",
        typePlan: result.typePlan ?? "",
        subscriberPlan: result.subscriberPlan ?? "",
        expirationDate: result.expirationDate ?? "",
        modules: result.modules ?? [],
      }, true);

      router.push("/pdv");
    } catch (error: any) {
      const msg = error?.response?.data?.result?.message ?? "Dados incorretos.";
      toast.warn(msg, { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pulpa</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistema de Vendas e Estoque</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              {...register("email", { required: "E-mail obrigatório" })}
              placeholder="seu@email.com"
              className="input-erp-primary input-erp-default pl-10"
            />
          </div>
          {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type={showPass ? "text" : "password"}
              {...register("password", { required: "Senha obrigatória" })}
              placeholder="••••••••"
              className="input-erp-primary input-erp-default pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end">
          <Link href="/reset-password" className="text-xs text-brand-500 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Não tem conta?{" "}
        <Link href="/signup" className="text-brand-500 hover:underline font-medium">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
