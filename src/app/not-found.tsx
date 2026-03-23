import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh w-dvw flex flex-col justify-center items-center gap-4">
      <h1 className="text-6xl font-bold text-brand-500">404</h1>
      <p className="text-gray-500 dark:text-gray-400">Página não encontrada.</p>
      <Link href="/pdv" className="text-brand-500 hover:underline text-sm">Voltar ao início</Link>
    </div>
  );
}
