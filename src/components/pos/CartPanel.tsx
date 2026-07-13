import { useState } from "react";
import { Plus, Minus, X, User, Tag, PauseCircle, Trash2 } from "lucide-react";
import type { CartItem } from "../../hooks/useCart";
import type { Id } from "../../../convex/_generated/dataModel";
import { formatCurrency } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { CustomerLookup } from "./CustomerLookup";
import { DiscountModal } from "./DiscountModal";

interface CartDiscount {
  type: "percent" | "flat";
  value: number;
}

interface CartPanelProps {
  items: CartItem[];
  totals: {
    subtotal: number;
    saleDiscountAmount: number;
    discountTotal: number;
    taxAmount: number;
    grandTotal: number;
  };
  saleDiscount: CartDiscount | null;
  customerId: Id<"customers"> | null;
  onUpdateQuantity: (variantId: Id<"productVariants">, qty: number) => void;
  onRemoveItem: (variantId: Id<"productVariants">) => void;
  onSetDiscount: (discount: CartDiscount | null) => void;
  onSetCustomer: (id: Id<"customers"> | null) => void;
  onClear: () => void;
  onHold: () => void;
  onPay: () => void;
  cashierRole: "admin" | "cashier";
  onBack?: () => void;
}

export function CartPanel({
  items,
  totals,
  saleDiscount,
  customerId,
  onUpdateQuantity,
  onRemoveItem,
  onSetDiscount,
  onSetCustomer,
  onClear,
  onHold,
  onPay,
  cashierRole,
  onBack,
}: CartPanelProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col h-full bg-white border-l border-[#E3DCC8]">
      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#2C5F2D] border-b border-[#E3DCC8] bg-[#F7F3E9] hover:bg-[#E3DCC8] transition-colors"
        >
          ? Products
        </button>
      )}
      {/* Customer row */}
      <div className="px-4 py-2.5 border-b border-[#E3DCC8] flex items-center gap-2">
        <User size={14} className="text-[#5C6B5C]" />
        <button
          onClick={() => setShowCustomerLookup(true)}
          className="flex-1 text-left text-sm text-[#5C6B5C] hover:text-[#2C5F2D] transition-colors"
        >
          {customerName ? (
            <span className="text-[#2C5F2D] font-medium">{customerName}</span>
          ) : (
            "Walk-in Customer"
          )}
        </button>
        {customerId && (
          <button
            onClick={() => { onSetCustomer(null); setCustomerName(null); }}
            className="text-[#5C6B5C] hover:text-[#DC2626]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-sm text-[#5C6B5C]">Cart is empty</p>
            <p className="text-sm text-[#5C6B5C] mt-1">Click a product to add it</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E3DCC8]">
            {items.map((item) => (
              <div key={item.variantId} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C5F2D] truncate">{item.productName}</p>
                    <p className="text-sm text-[#5C6B5C]">
                      {item.brandName} · {item.packageSize}ml · {item.sku}
                    </p>
                    <p className="text-sm text-[#5C6B5C] mt-0.5 font-mono">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.variantId)}
                    className="text-[#5C6B5C] hover:text-[#DC2626] mt-0.5 flex-shrink-0 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                      className="h-6 w-6 rounded border border-[#E3DCC8] flex items-center justify-center hover:bg-[#F7F3E9] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="h-6 w-6 rounded border border-[#E3DCC8] flex items-center justify-center hover:bg-[#F7F3E9] transition-colors disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-[#E3DCC8] px-4 py-3 space-y-1">
        <div className="flex justify-between text-sm text-[#5C6B5C]">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">{formatCurrency(totals.subtotal)}</span>
        </div>
        {totals.saleDiscountAmount > 0 && (
          <div className="flex justify-between text-sm text-[#16A34A]">
            <span>Discount</span>
            <span className="font-mono tabular-nums">-{formatCurrency(totals.saleDiscountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-[#5C6B5C]">
          <span>VAT (16%)</span>
          <span className="font-mono tabular-nums">{formatCurrency(totals.taxAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-[#2C5F2D] pt-2 border-t border-[#E3DCC8]">
          <span>Total</span>
          <span className="font-mono tabular-nums">{formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-24 md:pb-3 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiscountModal(true)}
            disabled={isEmpty}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 text-sm font-medium text-[#5C6B5C] border border-[#E3DCC8] rounded-md hover:bg-[#F7F3E9] disabled:opacity-30 transition-colors"
          >
            <Tag size={13} />
            Discount {saleDiscount && "(Applied)"}
          </button>
          <button
            onClick={onHold}
            disabled={isEmpty}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 text-sm font-medium text-[#5C6B5C] border border-[#E3DCC8] rounded-md hover:bg-[#F7F3E9] disabled:opacity-30 transition-colors"
          >
            <PauseCircle size={13} />
            Hold (F5)
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={isEmpty}
            className="h-9 w-9 flex items-center justify-center text-[#5C6B5C] border border-[#E3DCC8] rounded-md hover:bg-red-50 hover:text-[#DC2626] hover:border-[#DC2626] disabled:opacity-30 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <Button
          onClick={onPay}
          disabled={isEmpty}
          className="w-full h-12 text-sm"
          variant="primary"
        >
          Pay Now — {formatCurrency(totals.grandTotal)} (F12)
        </Button>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => { onClear(); setShowClearConfirm(false); }}
        title="Clear Cart"
        message="Remove all items from the cart?"
        confirmLabel="Clear Cart"
      />

      <CustomerLookup
        isOpen={showCustomerLookup}
        onClose={() => setShowCustomerLookup(false)}
        onSelect={(id, name) => {
          onSetCustomer(id);
          setCustomerName(name);
          setShowCustomerLookup(false);
        }}
      />

      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        currentDiscount={saleDiscount}
        subtotal={totals.subtotal}
        onApply={(discount) => { onSetDiscount(discount); setShowDiscountModal(false); }}
        isAdmin={cashierRole === "admin"}
      />
    </div>
  );
}
