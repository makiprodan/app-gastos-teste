"use client";

import { cn } from "@/lib/utils";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {ICON_OPTIONS.map((name) => {
        const Icon = getIcon(name);
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
              value === name
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
