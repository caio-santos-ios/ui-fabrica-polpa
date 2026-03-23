"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { reportFromAtom, reportToAtom } from "@/jotai/relatorio/relatorio.jotai";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { maskDate } from "@/utils/mask.util";
import { FiCalendar, FiSearch } from "react-icons/fi";

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

function KpiCard({ label, value, highlight, danger }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-brand-600 dark:text-brand-400" : danger ? "text-error-500" : "text-gray-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export default function ReportSales() {
  const [, setLoading] = useAtom(loadingAtom);
  const [from] = useAtom(reportFromAtom);
  const [to] = useAtom(reportToAtom);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/reports/sales-summary?from=${from}&to=${to}`, configApi());
        setSummary((data as any).result?.data);
      } catch (error) { resolveResponse(error); }
      finally { setLoading(false); }
    };
    load();
  }, [from, to]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Resumo de Vendas</h1>
      <DateFilters />

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <KpiCard label="Total de Vendas" value={String(summary.totalSales ?? 0)} />
            <KpiCard label="Receita Total" value={`R$ ${Number(summary.totalRevenue ?? 0).toFixed(2)}`} highlight />
            <KpiCard label="Lucro Bruto" value={`R$ ${Number(summary.totalGrossProfit ?? 0).toFixed(2)}`} />
            <KpiCard label="Margem Bruta" value={`${Number(summary.grossMarginPercent ?? 0).toFixed(1)}%`} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <Table className="divide-y">
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Data</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Vendas</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Receita</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lucro Bruto</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {(summary.dailyBreakdown ?? []).map((d: any) => (
                    <TableRow key={d.date}>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{maskDate(d.date)}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{d.salesCount}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300 font-medium">R$ {Number(d.revenue).toFixed(2)}</TableCell>
                      <TableCell className="px-5 py-4 text-start font-bold text-brand-600 dark:text-brand-400">R$ {Number(d.grossProfit).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
