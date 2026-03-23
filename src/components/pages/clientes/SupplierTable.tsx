"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { IconEdit } from "@/components/iconEdit/IconEdit";
import { IconDelete } from "@/components/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modalDelete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import Pagination from "@/components/tables/Pagination";
import { useModal } from "@/hooks/useModal";
import { maskDate, maskPhone } from "@/utils/mask.util";
import { TSupplier, ResetSupplier } from "@/types/domain.type";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function SupplierTable() {
  const [, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const { isOpen, openModal, closeModal } = useModal();
  const [supplier, setSupplier] = useState<TSupplier>(ResetSupplier);
  const router = useRouter();

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/suppliers?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`,
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

  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/suppliers/${supplier.id}`, configApi());
      resolveResponse({ status: 204, message: "Fornecedor excluído com sucesso" });
      closeModal();
      await getAll(1);
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  const getObj = (obj: any, action: string) => {
    setSupplier(obj);
    if (action === "edit") router.push(`/fornecedores/${obj.id}`);
    if (action === "delete") openModal();
  };

  useEffect(() => { getAll(1); }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Fornecedores</h1>
        <Link href="/fornecedores/novo" className="btn-erp-primary bg-brand-500 hover:bg-brand-600 w-auto px-5 gap-2">
          <FiPlus size={16} /> Novo Fornecedor
        </Link>
      </div>

      {pagination.data.length > 0 ? (
        <>
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mb-3">
            <div className="max-w-full overflow-x-auto tele-container-table">
              <div className="min-w-[700px] divide-y">
                <Table className="divide-y">
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nome</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">CNPJ</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contato</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Telefone</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Criado em</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ações</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {pagination.data.map((x: any) => (
                      <TableRow key={x.id}>
                        <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300 font-medium">{x.name}</TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{x.cnpj || "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{x.contactName || "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{x.phone ? maskPhone(x.phone) : "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{maskDate(x.createdAt)}</TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex gap-3">
                            <IconEdit action="edit" obj={x} getObj={getObj} />
                            <IconDelete action="delete" obj={x} getObj={getObj} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
          <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Fornecedor" />
        </>
      ) : (
        <NotData />
      )}
    </>
  );
}
