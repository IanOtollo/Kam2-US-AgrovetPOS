import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  LayoutDashboard,
  Receipt,
  Users,
  Package,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const allAdminItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Inventory", icon: Boxes, path: "/inventory" },
  { label: "Sales", icon: Receipt, path: "/sales" },
  { label: "POS", icon: ShoppingCart, path: "/pos", center: true },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const mobileAdminPrimaryItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Sales", icon: Receipt, path: "/sales" },
  { label: "POS", icon: ShoppingCart, path: "/pos", center: true },
  { label: "Products", icon: Package, path: "/products" },
];

const mobileCashierPrimaryItems = [
  { label: "Sales", icon: Receipt, path: "/sales" },
  { label: "POS", icon: ShoppingCart, path: "/pos", center: true },
  { label: "Customers", icon: Users, path: "/customers" },
];

const moreItems = [
  { label: "Customers", icon: Users, path: "/customers", adminOnly: false },
  { label: "Inventory", icon: Boxes, path: "/inventory", adminOnly: false },
  { label: "Reports", icon: BarChart3, path: "/reports", adminOnly: true },
  { label: "Settings", icon: Settings, path: "/settings", adminOnly: true },
];

export function BottomNav() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const [showMore, setShowMore] = useState(false);

  const desktopItems = isAdmin ? allAdminItems : mobileCashierPrimaryItems;
  const mobilePrimary = isAdmin ? mobileAdminPrimaryItems : mobileCashierPrimaryItems;
  const visibleMore = moreItems.filter((i) => !i.adminOnly || isAdmin);

  const isDashboard = location.pathname === "/";

  const handleLogout = () => {
    setShowMore(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Floating Desktop Bottom Nav (Glassmorphism + Scroll hide) */}
      <nav
        className={cn(
          "hidden md:flex fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "bg-[#2C5F2D]/85 backdrop-blur-2xl border border-[#1B3E1C]/50 shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-full px-2 py-2 items-center gap-1",
          scrollDirection === "down" ? "bottom-[-100px] opacity-0 scale-95" : (isDashboard ? "bottom-24 opacity-100 scale-100" : "bottom-6 opacity-100 scale-100")
        )}
      >
        {desktopItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#F7F3E9] text-[#2C5F2D] shadow-md"
                  : "text-white/80 hover:bg-[#1B3E1C]/80 hover:text-white"
              )
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/40 flex items-end transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgb(0,0,0,0.05)]",
          scrollDirection === "down" ? "translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {mobilePrimary.map((item) => {
          if (item.center) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={"flex-1 flex flex-col items-center pb-2"}
              >
                {({ isActive }) => (
                  <div className={cn("flex flex-col items-center gap-0.5", "-mt-5")}>
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-colors",
                      isActive ? "bg-[#1B3E1C]" : "bg-[#2C5F2D]"
                    )}>
                      <item.icon size={24} strokeWidth={2} className={"text-white"} />
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold mt-1",
                      isActive ? "text-[#2C5F2D]" : "text-[#5C6B5C]"
                    )}>
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
                  isActive ? "text-[#2C5F2D]" : "text-[#5C6B5C]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {isAdmin && (
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
              showMore ? "text-[#2C5F2D]" : "text-[#5C6B5C]"
            )}
          >
            <MoreHorizontal size={20} strokeWidth={2} />
            <span>More</span>
          </button>
        )}
      </nav>

      {/* More sheet (Mobile Only) */}
      {showMore && (
        <div className={"md:hidden fixed inset-0 z-50 flex flex-col justify-end"}>
          <div className={"absolute inset-0 bg-black/40 backdrop-blur-sm"} onClick={() => setShowMore(false)} />
          <div className={"relative bg-white/90 backdrop-blur-2xl rounded-t-3xl shadow-2xl pt-3 pb-8 px-4 border-t border-white/50"}>
            <div className={"w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"} />
            <div className={"flex items-center justify-between mb-5"}>
              <div className={"flex items-center gap-3"}>
                <div className={"w-10 h-10 rounded-full bg-[#2C5F2D] flex items-center justify-center shadow-inner"}>
                  <span className={"text-base font-bold text-white"}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className={"text-sm font-bold text-[#2C5F2D] leading-tight"}>{user?.name}</p>
                  <p className={"text-xs text-[#5C6B5C] capitalize mt-0.5"}>{user?.role}</p>
                </div>
              </div>
              <button onClick={() => setShowMore(false)} className={"p-2 rounded-full hover:bg-black/5 text-[#5C6B5C]"}>
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className={"grid grid-cols-4 gap-3 mb-5"}>
              {visibleMore.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center gap-2 p-3.5 rounded-2xl text-center transition-colors shadow-sm border border-white/50",
                      isActive
                        ? "bg-[#2C5F2D]/10 text-[#2C5F2D]"
                        : "bg-white text-[#5C6B5C] hover:bg-gray-50"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={"text-[11px] font-bold"}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className={"w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-600 text-sm font-bold shadow-sm border border-red-100"}
            >
              <LogOut size={18} strokeWidth={2.5} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}