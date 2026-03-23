"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiCheck, FiSearch, FiX } from "react-icons/fi";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { cartAtom, pdvModeAtom, activeSaleAtom, cartSubtotalAtom, cartChangeAtom, canFinalizeSaleAtom } from "@/jotai/pdv/pdv.jotai";
import { TCart, TCartItem, TProduct, TPaymentMethod, ResetCart } from "@/types/domain.type";
import { maskCurrency } from "@/utils/mask.util";
import { toast } from "react-toastify";

const PAYMENT_LABELS: Record<TPaymentMethod, string> = {
  Cash: "Dinheiro", CreditCard: "Cartão Crédito",
  DebitCard: "Cartão Débito", Pix: "Pix", Mixed: "Misto",
};

type TPaymentForm = { method: TPaymentMethod; amount: string };

export default function PDVContent() {
  const [cart, setCart] = useAtom(cartAtom);
  const subtotal = useAtomValue(cartSubtotalAtom);
  const change = useAtomValue(cartChangeAtom);
  const canFinalize = useAtomValue(canFinalizeSaleAtom);
  const [mode, setMode] = useAtom(pdvModeAtom);
  const setActiveSale = useSetAtom(activeSaleAtom);
  const activeSale = useAtomValue(activeSaleAtom);
  const [, setLoading] = useAtom(loadingAtom);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset } = useForm<TPaymentForm>({ defaultValues: { method: "Cash", amount: "" } });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await api.get("/products?deleted=false&active=true&pageSize=100", configApi());
      setProducts((data as any).result?.data ?? []);
    } catch (error) { resolveResponse(error); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: TProduct) => {
    setCart(prev => {
      const existing = prev.items.find(i => i.productId === product.id);
      let items: TCartItem[];
      if (existing) {
        if (existing.quantity >= existing.maxStock) {
          toast.warn("Estoque insuficiente", { theme: "colored" });
          return prev;
        }
        items = prev.items.map(i => i.productId === product.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
          : i
        );
      } else {
        items = [...prev.items, {
          productId: product.id, productName: product.name,
          weightGrams: product.weightGrams, quantity: 1,
          unitPrice: product.salePrice, discount: 0,
          subtotal: product.salePrice, maxStock: 999,
        }];
      }
      const newSubtotal = items.reduce((s, i) => s + i.subtotal, 0);
      return { ...prev, items, subtotal: newSubtotal, total: newSubtotal };
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      const items = prev.items
        .map(i => i.productId === productId
          ? { ...i, quantity: Math.max(0, Math.min(i.maxStock, i.quantity + delta)), subtotal: Math.max(0, Math.min(i.maxStock, i.quantity + delta)) * i.unitPrice }
          : i
        ).filter(i => i.quantity > 0);
      const newSubtotal = items.reduce((s, i) => s + i.subtotal, 0);
      return { ...prev, items, subtotal: newSubtotal, total: newSubtotal };
    });
  };

  const removeItem = (productId: string) => {
    setCart(prev => {
      const items = prev.items.filter(i => i.productId !== productId);
      const newSubtotal = items.reduce((s, i) => s + i.subtotal, 0);
      return { ...prev, items, subtotal: newSubtotal, total: newSubtotal };
    });
  };

  const addPayment = (data: TPaymentForm) => {
    const amount = parseFloat(data.amount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) return;
    setCart(prev => {
      const payments = [...prev.payments, { method: data.method, amount }];
      const paid = payments.reduce((s, p) => s + p.amount, 0);
      return { ...prev, payments, amountPaid: paid, change: paid - prev.total };
    });
    reset();
  };

  const removePayment = (idx: number) => {
    setCart(prev => {
      const payments = prev.payments.filter((_, i) => i !== idx);
      const paid = payments.reduce((s, p) => s + p.amount, 0);
      return { ...prev, payments, amountPaid: paid, change: paid - prev.total };
    });
  };

  const finalizeSale = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/sales", {
        customerId: cart.customerId,
        items: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity, discount: i.discount })),
        payments: cart.payments.map(p => ({ method: p.method, amount: p.amount })),
      }, configApi());
      const sale = (data as any).result?.data;
      setActiveSale(sale);
      setMode("success");
      setCart(ResetCart);
    } catch (error) { resolveResponse(error); }
    finally { setLoading(false); }
  };

  if (mode === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
          <FiCheck className="text-success-600 dark:text-success-400 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Venda #{activeSale?.saleNumber} concluída!
        </h2>
        {activeSale && (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Troco: <span className="font-bold text-success-600">R$ {activeSale.change.toFixed(2)}</span>
          </p>
        )}
        <button
          onClick={() => setMode("cart")}
          className="btn-erp-primary bg-brand-500 hover:bg-brand-600 w-48 mt-4"
        >
          Nova Venda
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100dvh-7rem)]">
      {/* Produtos */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="input-erp-primary input-erp-default pl-10 w-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto container-card">
          {filtered.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-left hover:border-brand-400 hover:shadow-theme-sm transition-all group"
            >
              <p className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-brand-600 line-clamp-2">{product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{product.weightGrams >= 1000 ? `${product.weightGrams / 1000}kg` : `${product.weightGrams}g`}</p>
              <p className="text-base font-bold text-brand-600 dark:text-brand-400 mt-2">R$ {product.salePrice.toFixed(2)}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </div>

      {/* Carrinho */}
      <div className="w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <FiShoppingCart className="text-brand-500" size={18} />
          <span className="font-semibold text-sm text-gray-800 dark:text-white">Carrinho</span>
          <span className="ml-auto text-xs text-gray-400">{cart.items.length} item(s)</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {cart.items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">Nenhum item</div>
          ) : (
            cart.items.map(item => (
              <div key={item.productId} className="flex items-center gap-2 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">R$ {item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, -1)} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 text-gray-600">
                    <FiMinus size={10} />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-gray-700 dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 text-gray-600">
                    <FiPlus size={10} />
                  </button>
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-white w-14 text-right">R$ {item.subtotal.toFixed(2)}</span>
                <button onClick={() => removeItem(item.productId)}>
                  <FiTrash2 size={13} className="text-error-400 hover:text-error-600" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
            <span className="text-xl font-bold text-brand-600 dark:text-brand-400">R$ {cart.total.toFixed(2)}</span>
          </div>

          <form onSubmit={handleSubmit(addPayment)} className="flex gap-2">
            <select {...register("method")} className="flex-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 focus:outline-none dark:text-white">
              {(Object.entries(PAYMENT_LABELS) as [TPaymentMethod, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input {...register("amount")} placeholder="0,00" className="w-24 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 focus:outline-none dark:text-white" />
            <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-3 py-2 transition-colors">
              <FiPlus size={14} />
            </button>
          </form>

          {cart.payments.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>{PAYMENT_LABELS[p.method]}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">R$ {p.amount.toFixed(2)}</span>
                <button onClick={() => removePayment(idx)}>
                  <FiX size={12} className="text-error-400 hover:text-error-600" />
                </button>
              </div>
            </div>
          ))}

          {cart.payments.length > 0 && (
            <div className="flex justify-between text-sm pt-1 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Troco</span>
              <span className={`font-bold ${change >= 0 ? "text-success-600" : "text-error-500"}`}>
                R$ {Math.max(0, change).toFixed(2)}
              </span>
            </div>
          )}

          <button
            onClick={finalizeSale}
            disabled={!canFinalize}
            className="btn-erp-primary bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed gap-2"
          >
            <FiCheck size={16} />
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}
