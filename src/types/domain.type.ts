// ─── Produto ────────────────────────────────────────────────────────────────
export type TProductCategory = "TropicalFruits" | "ExoticFruits" | "Mix";

export type TProduct = {
  id: string;
  name: string;
  description: string;
  category: TProductCategory;
  weightGrams: number;
  costPrice: number;
  salePrice: number;
  minStockLevel: number;
  supplierId: string;
  imageUrl: string;
  active: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export const ResetProduct: TProduct = {
  id: "", name: "", description: "", category: "TropicalFruits",
  weightGrams: 500, costPrice: 0, salePrice: 0, minStockLevel: 10,
  supplierId: "", imageUrl: "", active: true, deleted: false,
  createdAt: "", updatedAt: "",
};

// ─── Estoque ─────────────────────────────────────────────────────────────────
export type TStockBatch = {
  id: string;
  productId: string;
  supplierId: string;
  batchCode: string;
  quantity: number;
  initialQuantity: number;
  expiryDate: string;
  entryDate: string;
  costPrice: number;
  notes: string;
  active: boolean;
  deleted: boolean;
  createdAt: string;
};

export const ResetStockBatch: TStockBatch = {
  id: "", productId: "", supplierId: "", batchCode: "", quantity: 0,
  initialQuantity: 0, expiryDate: "", entryDate: "", costPrice: 0,
  notes: "", active: true, deleted: false, createdAt: "",
};

export type TStockAlert = {
  productId: string;
  productName: string;
  alertType: "LowStock" | "NearExpiry" | "Expired";
  currentStock: number;
  minStockLevel: number;
  batchId?: string;
  batchCode?: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
};

// ─── Venda ───────────────────────────────────────────────────────────────────
export type TPaymentMethod = "Cash" | "CreditCard" | "DebitCard" | "Pix" | "Mixed";
export type TSaleStatus = "Pending" | "Completed" | "Cancelled";

export type TSaleItem = {
  productId: string;
  productName: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discount: number;
};

export type TPaymentDetail = {
  method: TPaymentMethod;
  amount: number;
};

export type TSale = {
  id: string;
  saleNumber: number;
  customerId: string;
  items: TSaleItem[];
  payments: TPaymentDetail[];
  status: TSaleStatus;
  subtotal: number;
  totalDiscount: number;
  total: number;
  amountPaid: number;
  change: number;
  notes: string;
  completedAt?: string;
  createdAt: string;
};

export const ResetSale: TSale = {
  id: "", saleNumber: 0, customerId: "", items: [], payments: [],
  status: "Pending", subtotal: 0, totalDiscount: 0, total: 0,
  amountPaid: 0, change: 0, notes: "", createdAt: "",
};

// Carrinho PDV
export type TCartItem = {
  productId: string;
  productName: string;
  weightGrams: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  maxStock: number;
};

export type TCart = {
  items: TCartItem[];
  customerId: string;
  payments: TPaymentDetail[];
  subtotal: number;
  total: number;
  amountPaid: number;
  change: number;
};

export const ResetCart: TCart = {
  items: [], customerId: "", payments: [],
  subtotal: 0, total: 0, amountPaid: 0, change: 0,
};

// ─── Cliente ─────────────────────────────────────────────────────────────────
export type TAddress = {
  street: string; number: string; city: string; state: string; zipCode: string;
};

export type TCustomer = {
  id: string; name: string; cpf: string; phone: string;
  email: string; address: TAddress; active: boolean;
  deleted: boolean; createdAt: string;
};

export const ResetCustomer: TCustomer = {
  id: "", name: "", cpf: "", phone: "", email: "",
  address: { street: "", number: "", city: "", state: "", zipCode: "" },
  active: true, deleted: false, createdAt: "",
};

// ─── Fornecedor ───────────────────────────────────────────────────────────────
export type TSupplier = {
  id: string; name: string; cnpj: string; contactName: string;
  phone: string; email: string; address: TAddress;
  active: boolean; deleted: boolean; createdAt: string;
};

export const ResetSupplier: TSupplier = {
  id: "", name: "", cnpj: "", contactName: "", phone: "", email: "",
  address: { street: "", number: "", city: "", state: "", zipCode: "" },
  active: true, deleted: false, createdAt: "",
};

// ─── Relatório ────────────────────────────────────────────────────────────────
export type TDailySale = {
  date: string; salesCount: number; revenue: number; grossProfit: number;
};

export type TSalesSummary = {
  from: string; to: string; totalSales: number; totalRevenue: number;
  totalGrossProfit: number; grossMarginPercent: number;
  dailyBreakdown: TDailySale[];
};

export type TProductProfit = {
  productId: string; productName: string; category: string;
  weightGrams: number; totalQuantitySold: number; totalRevenue: number;
  totalCost: number; grossProfit: number; grossMarginPercent: number;
};
