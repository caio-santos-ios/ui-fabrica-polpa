"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { reportFromAtom, reportToAtom } from "@/jotai/relatorio/relatorio.jotai";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { FiCalendar } from "react-icons/fi";

const CATEGORY_LABELS: Record<string, string> = {
  TropicalFruits: "Tropicais", ExoticFruits: "Exóticas", Mix: "Mix",
};

function DateFilters() {
  const [from, setFrom] = useAtom(reportFromAtom);
  const [to, setTo] = useAtom(reportToAtom);
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-5 py-4 mb-5">
      <FiCalendar className="text-gray-400" size={16} />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">De</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input-erp-primary input-erp-default text-sm" />
        <label className="text-xs text-gray-500">até</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="input-erp-primary input-erp-default text-sm" />
      </div>
    </div>
  );
}

export default function ReportProfit() {
  const [, setLoading] = useAtom(loadingAtom);
  const [from] = useAtom(reportFromAtom);
  const [to] = useAtom(reportToAtom);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reports/product-profit?from=${from}&to=${to}`, configApi());
        setData((res.data as any).result?.data ?? []);
      } catch (error) { resolveResponse(error); }
      finally { setLoading(false); }
    };
    load();
  }, [from, to]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Lucro por Produto</h1>
      <DateFilters />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table className="divide-y">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Produto</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Categoria</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Qtd. Vendida</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Receita</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lucro Bruto</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Margem</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {data.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-400 dark:text-gray-500" colSpan={6}>
                    Nenhum dado no período
                  </TableCell>
                </TableRow>
              )}
              {data.map((x: any) => (
                <TableRow key={x.productId}>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{x.productName}</p>
                    <p className="text-xs text-gray-400">{x.weightGrams >= 1000 ? `${x.weightGrams / 1000}kg` : `${x.weightGrams}g`}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{CATEGORY_LABELS[x.category] ?? x.category}</TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{x.totalQuantitySold}</TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">R$ {Number(x.totalRevenue).toFixed(2)}</TableCell>
                  <TableCell className="px-5 py-4 text-start font-bold text-brand-600 dark:text-brand-400">R$ {Number(x.grossProfit).toFixed(2)}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      x.grossMarginPercent >= 30 ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                      : x.grossMarginPercent >= 15 ? "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400"
                      : "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
                    }`}>
                      {Number(x.grossMarginPercent).toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
