"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { FiAlertTriangle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { maskDate } from "@/utils/mask.util";
import Link from "next/link";

export default function StockAlerts() {
  const [, setLoading] = useAtom(loadingAtom);
  const [alerts, setAlerts] = useState<{ nearExpiry: any[]; expired: any[]; lowStock: any[] }>({
    nearExpiry: [], expired: [], lowStock: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/stock/alerts", configApi());
        const result = (data as any).result?.data;
        if (result) setAlerts(result);
      } catch (error) { resolveResponse(error); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const AlertCard = ({ title, icon, items, color, renderRow }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700 ${color}`}>
        {icon}
        <span className="font-semibold text-sm">{title}</span>
        <span className="ml-auto text-xs font-medium bg-white/30 dark:bg-black/20 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-20 text-sm text-gray-400">Nenhum item</div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="px-5 py-3 text-sm">{renderRow(item)}</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/estoque/lotes" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
          <FiArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Alertas de Estoque</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertCard
          title="Vencidos"
          icon={<FiAlertCircle size={16} className="text-error-600" />}
          items={alerts.expired}
          color="text-error-700 dark:text-error-400 bg-error-50 dark:bg-error-900/20"
          renderRow={(item: any) => (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">{item.batchCode}</p>
                <p className="text-xs text-gray-400">Val: {maskDate(item.expiryDate)}</p>
              </div>
              <span className="font-bold text-error-600">{item.quantity} un.</span>
            </div>
          )}
        />

        <AlertCard
          title="Próximos do vencimento (7 dias)"
          icon={<FiAlertTriangle size={16} className="text-warning-600" />}
          items={alerts.nearExpiry}
          color="text-warning-700 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20"
          renderRow={(item: any) => (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">{item.batchCode}</p>
                <p className="text-xs text-gray-400">Val: {maskDate(item.expiryDate)}</p>
              </div>
              <span className="font-bold text-warning-600">{item.quantity} un.</span>
            </div>
          )}
        />

        <AlertCard
          title="Estoque Baixo"
          icon={<FiAlertTriangle size={16} className="text-orange-600" />}
          items={alerts.lowStock}
          color="text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
          renderRow={(item: any) => (
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-700 dark:text-gray-200">{item.productName}</p>
              <span className="font-bold text-orange-600">{item.currentStock} / {item.minStockLevel}</span>
            </div>
          )}
        />
      </div>
    </>
  );
}
