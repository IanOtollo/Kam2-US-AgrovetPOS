import { forwardRef, useState, useRef, useEffect } from "react";
import type { SelectHTMLAttributes, ChangeEvent } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, value, onChange, name, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (val: string) => {
      setIsOpen(false);
      if (onChange) {
        // Create a mocked event object that perfectly matches what React handlers expect
        const mockEvent = {
          target: { name, value: val },
          currentTarget: { name, value: val },
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as ChangeEvent<HTMLSelectElement>;
        onChange(mockEvent);
      }
    };

    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || "Select...");

    return (
      <div className={cn("w-full", className)} ref={containerRef}>
        {label && (
          <label className={"block text-sm font-medium text-[#5C6B5C] mb-1.5"}>
            {label}
          </label>
        )}
        
        <div className={"relative w-full"}>
          {/* Custom Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full h-10 px-3 border rounded-lg text-sm transition-all duration-200 outline-none",
              "bg-white shadow-sm hover:border-[#2C5F2D]/50",
              isOpen ? "border-[#2C5F2D] ring-2 ring-[#2C5F2D]/20" : "border-[#E3DCC8]",
              error && "border-[#DC2626] hover:border-[#DC2626] focus:ring-[#DC2626]/20",
              !selectedOption && "text-[#5C6B5C]" // Placeholder text color
            )}
          >
            <span className={cn("truncate font-medium", selectedOption ? "text-[#0A0A0A]" : "text-[#5C6B5C]/80")}>
              {displayLabel}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "text-[#5C6B5C] transition-transform duration-200 flex-shrink-0",
                isOpen && "rotate-180 text-[#2C5F2D]"
              )}
            />
          </button>

          {/* Hidden native select for form accessibility/refs if needed */}
          <select
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            className={"hidden"}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Dropdown Menu */}
          {isOpen && (
            <div 
              className={cn(
                "absolute z-50 w-full mt-1.5 py-1 bg-white/90 backdrop-blur-xl border border-[#E3DCC8] rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]",
                "max-h-60 overflow-y-auto overflow-x-hidden origin-top animate-in fade-in slide-in-from-top-2 duration-200"
              )}
            >
              {options.length === 0 ? (
                <div className={"px-4 py-3 text-sm text-[#5C6B5C] text-center italic"}>
                  No options available
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors text-left",
                        isSelected 
                          ? "bg-[#F7F3E9] text-[#2C5F2D] font-bold" 
                          : "text-[#4A4A4A] hover:bg-[#F7F3E9]/50 hover:text-[#2C5F2D] font-medium"
                      )}
                    >
                      <span className={"truncate"}>{opt.label}</span>
                      {isSelected && <Check size={16} className={"text-[#2C5F2D] flex-shrink-0 ml-2"} strokeWidth={3} />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {error && <p className={"mt-1.5 text-sm text-[#DC2626] font-medium animate-in fade-in"}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";