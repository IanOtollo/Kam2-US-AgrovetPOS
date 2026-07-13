import type { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function EmptyState({ message, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-[#5C6B5C] mb-4">{icon}</div>}
      <p className="text-sm font-medium text-[#5C6B5C]">{message}</p>
      {description && (
        <p className="text-sm text-[#5C6B5C] mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4" variant="secondary" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
