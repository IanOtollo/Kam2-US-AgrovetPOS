import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B5C]"
        />
        <input
          ref={ref}
          type="text"
          className={cn(
            "h-10 pl-9 pr-3 border border-[#E3DCC8] rounded-md text-sm bg-white focus:border-[#2C5F2D] focus:ring-1 focus:ring-[#2C5F2D] outline-none transition-all duration-150 text-[#2C5F2D] placeholder:text-[#5C6B5C]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
