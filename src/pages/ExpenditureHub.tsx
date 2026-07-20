import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ExpensesView } from "./expenditure/ExpensesView";
import { PurchasesView } from "./expenditure/PurchasesView";
import { SuppliersView } from "./expenditure/SuppliersView";
import { cn } from "../lib/utils";
import { Wallet, ShoppingBag, Truck } from "lucide-react";

export function ExpenditureHub() {
  const [activeTab, setActiveTab] = useState<"expenses" | "purchases" | "suppliers">("expenses");

  return (
    <AdminLayout title="Expenditure Hub">
      <div className="bg-white border border-[#E3DCC8] rounded-md p-1 mb-6 flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("expenses")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold whitespace-nowrap transition-all",
            activeTab === "expenses"
              ? "bg-[#2C5F2D] text-white shadow-md"
              : "text-[#5C6B5C] hover:bg-gray-50"
          )}
        >
          <Wallet size={16} /> Operating Expenses
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold whitespace-nowrap transition-all",
            activeTab === "purchases"
              ? "bg-[#2C5F2D] text-white shadow-md"
              : "text-[#5C6B5C] hover:bg-gray-50"
          )}
        >
          <ShoppingBag size={16} /> Stock Purchases
        </button>
        <button
          onClick={() => setActiveTab("suppliers")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold whitespace-nowrap transition-all",
            activeTab === "suppliers"
              ? "bg-[#2C5F2D] text-white shadow-md"
              : "text-[#5C6B5C] hover:bg-gray-50"
          )}
        >
          <Truck size={16} /> Suppliers
        </button>
      </div>

      <div className="min-h-[500px]">
        {activeTab === "expenses" && <ExpensesView />}
        {activeTab === "purchases" && <PurchasesView />}
        {activeTab === "suppliers" && <SuppliersView />}
      </div>
    </AdminLayout>
  );
}
