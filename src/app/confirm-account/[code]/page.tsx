"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { FiCheck, FiX } from "react-icons/fi";
import Link from "next/link";

export default function ConfirmAccountCodePage({ params }: { params: { code: string } }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();

  useEffect(() => {
    const confirm = async () => {
      try {
        await api.post("/auth/confirm-account", { code: params.code });
        setStatus("success");
        setTimeout(() => router.push("/"), 2500);
      } catch {
        setStatus("error");
      }
    };
    confirm();
  }, [params.code]);

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800 text-center">
        {status === "loading" && <p className="text-gray-500">Verificando...</p>}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-success-600 text-3xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Conta confirmada!</h1>
            <p className="text-sm text-gray-500 mt-2">Redirecionando para o login...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4">
              <FiX className="text-error-600 text-3xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Código inválido</h1>
            <p className="text-sm text-gray-500 mt-2">O código expirou ou já foi utilizado.</p>
            <Link href="/" className="inline-block mt-4 text-brand-500 hover:underline text-sm">Voltar ao login</Link>
          </>
        )}
      </div>
    </div>
  );
}
