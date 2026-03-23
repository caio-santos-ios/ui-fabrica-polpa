import { Metadata } from "next";

export const metadata: Metadata = { title: "Pulpa | Confirmar Conta" };

export default function ConfirmAccountPage() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirme sua conta</h1>
        <p className="text-sm text-gray-500">Verifique seu e-mail e clique no link de confirmação enviado.</p>
      </div>
    </div>
  );
}
