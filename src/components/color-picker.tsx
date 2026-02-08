"use client";

import { cn } from "@/lib/utils";
import { COLOR_OPTIONS } from "@/lib/colors";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform",
            value === color
              ? "scale-110 border-foreground"
              : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: color }}
        >
          {value === color && <Check className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  );
}
