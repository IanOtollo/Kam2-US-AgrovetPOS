import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AdminLayout } from "../components/layout/AdminLayout";
import { formatCurrency, formatCurrencyShort } from "../lib/utils";
import { SkeletonCard } from "../components/ui/Skeleton";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ShoppingBag,
  ShoppingCart,
  Box,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  ArrowRight,
  FileBarChart,
  PlusCircle,
  Users,
  Zap,
} from "lucide-react";

const ACCENT = "#2C5F2D";
const CATEGORY_COLORS = ["#8B5CF6", "#3B82F6", "#EC4899", "#F59E0B", "#10B981", "#6366F1"];
const PAYMENT_COLORS: Record<string, string> = {
  cash: "#10B981",
  card: "#3B82F6",
  mpesa: "#F59E0B",
  split: "#8B5CF6",
};
const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  mpesa: "M-Pesa",
  split: "Split",
};

function KpiCard({
  label,
  value,
  icon,
  change,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: number | null;
  iconBg: string;
  iconColor: string;
}) {
  const isPositive = change !== null && change >= 0;
  return (
    <div className="bg-white border border-[#E3DCC8] rounded-md p-3 flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#5C6B5C] truncate">{label}</p>
        <p className="text-sm font-bold font-mono text-[#0A0A0A] mt-0.5 truncate">{value}</p>
        <div
          className={`flex items-center gap-1 mt-0.5 flex-wrap ${
            change === null ? "text-[#5C6B5C]" : isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change !== null ? (
            <>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span className="text-[10px] font-medium">{Math.abs(change).toFixed(1)}%</span>
              <span className="text-[10px] text-[#5C6B5C]">vs yesterday</span>
            </>
          ) : (
            <span className="text-[10px]">-</span>
          )}
        </div>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "New Sale", shortcut: "F1", icon: ShoppingCart, path: "/pos" },
  { label: "Customers", shortcut: "F2", icon: Users, path: "/customers" },
  { label: "Add Product", shortcut: "F3", icon: PlusCircle, path: "/products" },
  { label: "Reports", shortcut: "F4", icon: FileBarChart, path: "/reports" },
  { label: "Inventory", shortcut: "F5", icon: Zap, path: "/inventory" },
];

export function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<"today" | "week" | "month">("week");
  const { user } = useAuth();
  const navigate = useNavigate();

  const kpis = useQuery(api.reports.getDashboardKPIs);
  const chartData = useQuery(api.reports.getRevenueByDayDashboard, { period: chartPeriod });
  const topProducts = useQuery(api.reports.getTopSellingProducts, { limit: 5 });
  const categoryData = useQuery(api.reports.getSalesByCategory);
  const paymentData = useQuery(api.reports.getPaymentSummaryToday);
  const lowStockItems = useQuery(api.reports.getLowStockDashboard, { limit: 5 });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const actions: Record<string, string> = {
        F1: "/pos",
        F2: "/customers",
        F3: "/products",
        F4: "/reports",
        F5: "/inventory",
      };
      if (actions[e.key]) {
        e.preventDefault();
        navigate(actions[e.key]);
      }
    },
    [navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasChartData = chartData && chartData.some((d) => d.revenue > 0);

  return (
    <AdminLayout>
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-2">
        <div>
          <h1 className="text-xl font-semibold text-[#0A0A0A]">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-[#5C6B5C] mt-0.5">
            Here's what's happening at your store today.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[#5C6B5C]">
          <Calendar size={14} className="flex-shrink-0" />
          <span className="text-xs sm:text-sm">{formattedDate}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {kpis ? (
          <>
            <KpiCard
              label="Total Sales"
              value={formatCurrencyShort(kpis.revenue.today)}
              icon={<ShoppingBag size={22} />}
              change={kpis.revenue.pctChange ?? null}
              iconBg="#e8e7ef"
              iconColor={ACCENT}
            />
            <KpiCard
              label="Transactions"
              value={kpis.transactions.today.toString()}
              icon={<ShoppingCart size={22} />}
              change={kpis.transactions.pctChange ?? null}
              iconBg="#eff6ff"
              iconColor="#3B82F6"
            />
            <KpiCard
              label="Items Sold"
              value={kpis.items.today.toString()}
              icon={<Box size={22} />}
              change={kpis.items.pctChange ?? null}
              iconBg="#fffbeb"
              iconColor="#F59E0B"
            />
            <KpiCard
              label="Gross Profit"
              value={formatCurrencyShort(kpis.grossProfit.today)}
              icon={<Wallet size={22} />}
              change={kpis.grossProfit.pctChange ?? null}
              iconBg="#f0fdf4"
              iconColor="#10B981"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        )}
      </div>

      {/* Main grid: left 2/3, right 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-4 lg:pb-16">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">
          {/* Sales Overview */}
          <div className="bg-white border border-[#E3DCC8] rounded-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C6B5C]">
                Sales Overview
              </p>
              <div className="flex items-center gap-0.5 bg-[#F7F3E9] rounded-md p-0.5 self-start sm:self-auto">
                {(["today", "week", "month"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                      chartPeriod === p
                        ? "bg-white text-[#0A0A0A] font-medium shadow-sm"
                        : "text-[#5C6B5C] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
                  </button>
                ))}
              </div>
            </div>

            {hasChartData ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3DCC8" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#5C6B5C" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#5C6B5C" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                    contentStyle={{
                      fontSize: 12,
                      border: "1px solid #E3DCC8",
                      borderRadius: 6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={ACCENT}
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
                    activeDot={{ fill: ACCENT, r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center gap-2">
                <FileBarChart size={32} strokeWidth={1} className="text-[#E3DCC8]" />
                <p className="text-sm text-[#5C6B5C]">No sales data yet.</p>
              </div>
            )}
          </div>

          {/* Category + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Sales By Category */}
            <div className="bg-white border border-[#E3DCC8] rounded-md p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C6B5C] mb-4">
                Sales by Category
              </p>
              {categoryData && categoryData.length > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <PieChart width={110} height={110}>
                      <Pie
                        data={categoryData}
                        dataKey="revenue"
                        nameKey="name"
                        innerRadius={30}
                        outerRadius={52}
                        paddingAngle={2}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {categoryData.slice(0, 5).map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-xs flex-1 truncate text-[#5C6B5C]">{cat.name}</span>
                        <span className="text-xs font-semibold text-[#0A0A0A]">
                          {cat.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[110px] flex items-center justify-center text-sm text-[#5C6B5C]">
                  No category data yet.
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-[#E3DCC8] rounded-md p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C6B5C] mb-4">
                Payment Summary
              </p>
              {paymentData && paymentData.length > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <PieChart width={110} height={110}>
                      <Pie
                        data={paymentData}
                        dataKey="amount"
                        nameKey="method"
                        innerRadius={30}
                        outerRadius={52}
                        paddingAngle={2}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {paymentData.map((entry) => (
                          <Cell
                            key={entry.method}
                            fill={PAYMENT_COLORS[entry.method] ?? "#5C6B5C"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {paymentData.map((entry) => (
                      <div key={entry.method} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PAYMENT_COLORS[entry.method] ?? "#5C6B5C" }}
                        />
                        <span className="text-xs flex-1 text-[#5C6B5C]">
                          {PAYMENT_LABELS[entry.method] ?? entry.method}
                        </span>
                        <span className="text-xs font-semibold font-mono text-[#0A0A0A]">
                          {formatCurrencyShort(entry.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[110px] flex items-center justify-center text-sm text-[#5C6B5C]">
                  No payments today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Top Selling Perfumes */}
          <div className="bg-white border border-[#E3DCC8] rounded-md p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C6B5C]">
                Top Selling Perfumes
              </p>
              <button
                onClick={() => navigate("/products")}
                className="flex items-center gap-1 text-xs text-[#2C5F2D] hover:underline"
              >
                View All <ArrowRight size={11} />
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-1 pb-2 border-b border-[#E3DCC8] text-[10px] font-medium uppercase tracking-wider text-[#5C6B5C]">
              <span>Product</span>
              <span className="text-right w-8">Qty</span>
              <span className="text-right w-14">Revenue</span>
            </div>

            {topProducts && topProducts.length > 0 ? (
              <div className="divide-y divide-[#E3DCC8]">
                {topProducts.map((product, idx) => (
                  <div key={product.sku} className="flex items-center gap-2 py-2.5">
                    <span className="text-xs font-bold text-[#C0C0C0] w-4 flex-shrink-0 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-md bg-[#E3DCC8] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={13} className="text-[#5C6B5C]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0A0A0A] truncate">
                        {product.productName}
                      </p>
                      <p className="text-[10px] text-[#5C6B5C] truncate">
                        {product.brandName} Â· {product.packageSize}ml
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-right w-8 flex-shrink-0">
                      {product.qtySold}
                    </span>
                    <span className="text-[11px] font-semibold font-mono text-right w-14 flex-shrink-0">
                      {formatCurrencyShort(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center gap-2">
                <ShoppingBag size={28} strokeWidth={1} className="text-[#E3DCC8]" />
                <p className="text-sm text-[#5C6B5C]">No sales data yet.</p>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white border border-[#E3DCC8] rounded-md p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C6B5C]">
                Low Stock Alert
              </p>
              <button
                onClick={() => navigate("/inventory")}
                className="flex items-center gap-1 text-xs text-[#2C5F2D] hover:underline"
              >
                View All <ArrowRight size={11} />
              </button>
            </div>

            {lowStockItems && lowStockItems.length > 0 ? (
              <div className="space-y-1">
                {lowStockItems.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-md bg-[#E3DCC8] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={14} className="text-[#5C6B5C]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0A0A0A] truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-[#5C6B5C]">
                        {item.brandName} Â· {item.packageSize}ml
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                      {item.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#5C6B5C]">All stock levels are healthy.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Bar - desktop only */}
      <div
        className="hidden lg:flex fixed bottom-0 z-20 bg-white border-t border-[#E3DCC8] h-12 px-6 items-center gap-1"
        style={{ left: 240, right: 0 }}
      >
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#5C6B5C] mr-3">
          Quick Actions:
        </span>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.shortcut}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#5C6B5C] hover:text-[#2C5F2D] hover:bg-[#F7F3E9] transition-colors"
          >
            <action.icon size={13} />
            <span className="text-xs">{action.label}</span>
            <span className="text-[10px] bg-[#E3DCC8] px-1.5 py-0.5 rounded font-mono text-[#5C6B5C]">
              {action.shortcut}
            </span>
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}
