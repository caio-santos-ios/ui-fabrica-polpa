"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { NotData } from "@/components/not-data/NotData";
import Pagination from "@/components/tables/Pagination";
import { maskDate } from "@/utils/mask.util";
import Link from "next/link";
import { FiPlus, FiAlertTriangle, FiAlertCircle } from "react-icons/fi";

export default function EstoqueContent() {
  const [, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/stock?deleted=false&orderBy=expiryDate&sort=asc&pageSize=10&pageNumber=${page}`,
        configApi()
      );
      const result = (data as any).result;
      setPagination({
        currentPage: result.currentPage,
        data: result.data,
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      });
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { getAll(1); }, []);

  const getBatchStatus = (row: any) => {
    const expiry = new Date(row.expiryDate);
    const now = new Date();
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: "Vencido", class: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400" };
    if (diff <= 7) return { label: `Vence em ${Math.floor(diff)}d`, class: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400" };
    return { label: "Normal", class: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400" };
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Lotes de Estoque</h1>
        <div className="flex gap-3">
          <Link href="/estoque/alertas" className="btn-erp-primary bg-warning-500 hover:bg-warning-600 w-auto px-5 gap-2 text-white">
            <FiAlertTriangle size={16} /> Alertas
          </Link>
          <Link href="/estoque/lotes/novo" className="btn-erp-primary bg-brand-500 hover:bg-brand-600 w-auto px-5 gap-2">
            <FiPlus size={16} /> Novo Lote
          </Link>
        </div>
      </div>

      {pagination.data.length > 0 ? (
        <>
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mb-3">
            <div className="max-w-full overflow-x-auto tele-container-table">
              <div className="min-w-[900px] divide-y">
                <Table className="divide-y">
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lote</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Produto</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Quantidade</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Validade</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Custo Unit.</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {pagination.data.map((x: any) => {
                      const status = getBatchStatus(x);
                      return (
                        <TableRow key={x.id}>
                          <TableCell className="px-5 py-4 text-start font-mono text-xs text-gray-600 dark:text-gray-300">{x.batchCode}</TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300 font-medium">{x.productId}</TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                            <span className="font-bold text-gray-700 dark:text-white">{x.quantity}</span>
                            <span className="text-xs text-gray-400 ml-1">/ {x.initialQuantity}</span>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{maskDate(x.expiryDate)}</TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">R$ {Number(x.costPrice).toFixed(2)}</TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.class}`}>{status.label}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalCount={pagination.totalCount}
            totalData={pagination.data.length}
            totalPages={pagination.totalPages}
            onPageChange={(page) => getAll(page)}
          />
        </>
      ) : (
        <NotData />
      )}
    </>
  );
}
