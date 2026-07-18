import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Search, Settings, Package, Users, ChevronRight, X, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { BottomNav } from "./BottomNav";
import { cn } from "../../lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const settings = useQuery(api.settings.getAll);
  const shopName = settings === undefined ? "" : (settings["shop_name"] ?? "Kam2-US Agrovet");

  // Global search data
  const products = useQuery(api.products.list, {});
  const customers = useQuery(api.customers.list);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };



  const queryLower = searchQuery.toLowerCase().trim();
  const matchedProducts = queryLower
    ? (products ?? []).filter((p) => p.name.toLowerCase().includes(queryLower) || p.brandName?.toLowerCase().includes(queryLower) || p.variants[0]?.sku?.toLowerCase().includes(queryLower)).slice(0, 5)
    : [];
  
  const matchedCustomers = queryLower
    ? (customers ?? []).filter((c) => c.name.toLowerCase().includes(queryLower) || c.phone?.toLowerCase().includes(queryLower)).slice(0, 3)
    : [];

  const hasResults = matchedProducts.length > 0 || matchedCustomers.length > 0;

  return (
    <div className={"flex min-h-screen bg-[#F7F3E9]"}>
      <main className={"flex-1 min-h-screen pb-20 md:pb-24 min-w-0 flex flex-col relative"}>
        {/* Top header bar */}
        <header className={"sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E3DCC8] h-[72px] px-4 md:px-6 flex items-center gap-4 flex-shrink-0 shadow-sm"}>
          
          {/* Shop branding */}
          <div className={"flex items-center gap-3 flex-shrink-0"}>
            <div className={"w-[42px] h-[42px] flex items-center justify-center flex-shrink-0"}>
              <img
                src="/kam2-us-logo.png"
                alt="Logo"
                className={"w-full h-full object-contain"}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className={"hidden sm:flex flex-col"}>
              <span className={"text-sm font-bold text-[#2C5F2D] leading-tight tracking-tight"}>{shopName}</span>
              <span className={"text-[10px] font-bold text-[#5C6B5C] uppercase tracking-wider"}>Bugengi</span>
            </div>
          </div>

          {/* Global Search Popover */}
          <div className={"flex-1 relative max-w-md ml-2 sm:ml-4"} ref={searchContainerRef}>
            <div className={"relative z-50"}>
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  if (e.target.value.trim()) setIsSearchOpen(true);
                }}
                placeholder="Search anything..."
                className={cn(
                  "w-full h-10 pl-4 pr-10 border rounded-full text-sm outline-none transition-all duration-300",
                  isSearchOpen ? "border-[#2C5F2D] bg-white ring-4 ring-[#2C5F2D]/10 shadow-md" : "border-[#E3DCC8] bg-white/50 focus:bg-white",
                  "placeholder:text-[#5C6B5C]"
                )}
              />
              <Search size={16} className={"absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C6B5C] pointer-events-none"} />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                  className={"absolute right-9 top-1/2 -translate-y-1/2 p-1 text-[#5C6B5C] hover:bg-black/5 rounded-full"}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {isSearchOpen && queryLower && (
              <div className={"absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-[#E3DCC8] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"}>
                
                <div className={"max-h-[60vh] overflow-y-auto p-2 space-y-4"}>
                  {!hasResults ? (
                    <div className={"py-8 text-center text-[#5C6B5C]"}>
                      <p className={"text-sm font-medium"}>No results found for "{queryLower}"</p>
                      <p className={"text-xs mt-1"}>Try a different search term</p>
                    </div>
                  ) : (
                    <>
                      {/* Products Section */}
                      {matchedProducts.length > 0 && (
                        <div>
                          <div className={"px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-[#5C6B5C] uppercase tracking-wider"}>
                            <Package size={12} /> Products
                          </div>
                          <div className={"space-y-1"}>
                            {matchedProducts.map((p) => (
                              <button
                                key={p._id}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  navigate(`/products?q=${encodeURIComponent(p.name)}`);
                                }}
                                className={"w-full flex flex-col text-left px-3 py-2 rounded-xl hover:bg-[#F7F3E9] transition-colors group"}
                              >
                                <div className={"flex items-center justify-between"}>
                                  <span className={"text-sm font-bold text-[#0A0A0A] group-hover:text-[#2C5F2D] truncate"}>{p.name}</span>
                                  <span className={"text-xs font-bold text-[#2C5F2D]"}>KSh {(p.variants[0]?.sellingPrice || 0).toFixed(2)}</span>
                                </div>
                                <div className={"flex items-center gap-2 mt-0.5 text-[11px] text-[#5C6B5C]"}>
                                  {p.variants[0]?.sku && <span>SKU: {p.variants[0]?.sku}</span>}
                                  {p.brandName && <span>• {p.brandName}</span>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Customers Section */}
                      {matchedCustomers.length > 0 && (
                        <div>
                          <div className={"px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-[#5C6B5C] uppercase tracking-wider border-t border-[#E3DCC8]/50 mt-1 pt-3"}>
                            <Users size={12} /> Customers
                          </div>
                          <div className={"space-y-1"}>
                            {matchedCustomers.map((c) => (
                              <button
                                key={c._id}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  navigate(`/customers?q=${encodeURIComponent(c.name)}`);
                                }}
                                className={"w-full flex flex-col text-left px-3 py-2 rounded-xl hover:bg-[#F7F3E9] transition-colors group"}
                              >
                                <span className={"text-sm font-bold text-[#0A0A0A] group-hover:text-[#2C5F2D] truncate"}>{c.name}</span>
                                <span className={"text-[11px] text-[#5C6B5C] mt-0.5"}>{c.phone}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer Action */}
                <div className={"p-2 bg-[#F7F3E9]/50 border-t border-[#E3DCC8] backdrop-blur-sm"}>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className={"w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-[#2C5F2D] rounded-xl hover:bg-[#2C5F2D] hover:text-white transition-colors"}
                  >
                    <span>Search all products for "{searchQuery}"</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Right side */}
          <div className={"flex items-center gap-1.5 ml-auto"}>
            <button
              className={"p-2 rounded-full hover:bg-black/5 text-[#5C6B5C] transition-colors"}
              onClick={() => navigate("/settings")}
              title="Settings"
            >
              <Settings size={20} strokeWidth={2} />
            </button>
            <div className={"flex items-center pl-3 ml-1 border-l border-gray-300"}>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className={"flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-[#DC2626] bg-red-50 hover:bg-red-100 rounded-md transition-colors"}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className={"flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto"}>
          {title && (
            <div className={"flex items-center justify-between mb-4 md:mb-6"}>
              <h1 className={"text-xl md:text-2xl font-bold text-[#2C5F2D] tracking-tight"}>
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}