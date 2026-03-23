"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { reportFromAtom, reportToAtom } from "@/jotai/relatorio/relatorio.jotai";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { maskDate } from "@/utils/mask.util";
import { FiCalendar } from "react-icons/fi";

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

export default function ReportLosses() {
  const [, setLoading] = useAtom(loadingAtom);
  const [from] = useAtom(reportFromAtom);
  const [to] = useAtom(reportToAtom);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reports/stock-losses?from=${from}&to=${to}`, configApi());
        setSummary((res.data as any).result?.data);
      } catch (error) { resolveResponse(error); }
      finally { setLoading(false); }
    };
    load();
  }, [from, to]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Perdas de Estoque</h1>
      <DateFilters />

      {summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { label: "Eventos de Perda", value: String(summary.totalLossEvents ?? 0) },
              { label: "Unidades Perdidas", value: String(summary.totalQuantityLost ?? 0) },
              { label: "Valor Total Perdido", value: `R$ ${Number(summary.totalValueLost ?? 0).toFixed(2)}` },
            ].map(k => (
              <div key={k.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-error-500">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <Table className="divide-y">
                <TableHeader className="border-b border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Produto</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lote</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Qtd.</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Valor</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Motivo</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Data</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {(summary.details ?? []).length === 0 && (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-gray-400 dark:text-gray-500" colSpan={6}>
                        Nenhuma perda registrada no período
                      </TableCell>
                    </TableRow>
                  )}
                  {(summary.details ?? []).map((d: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300 font-medium">{d.productName}</TableCell>
                      <TableCell className="px-5 py-4 text-start font-mono text-xs text-gray-500 dark:text-gray-400">{d.batchId}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{d.quantity}</TableCell>
                      <TableCell className="px-5 py-4 text-start font-bold text-error-500">R$ {Number(d.valueLost).toFixed(2)}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{d.reason}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{maskDate(d.registeredAt)}</TableCell>
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
