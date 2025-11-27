import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const options = [
  { id: "male", label: "Male", value: false },
  { id: "female", label: "Female", value: true },
];

interface GenderRadioGroupProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function GenderRadioGroup({ value, onChange }: GenderRadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      value={String(value)}
      onValueChange={(val: string) => onChange(val === "true")}
      className="grid grid-cols-3 gap-4"
    >
      {options.map((opt) => (
        <div
          key={opt.id}
          className={cn(
            "mt-2 flex items-center space-x-2 rounded-lg px-4 py-2 ring transition-all duration-300",
            value === opt.value
              ? "ring-primary/10 bg-muted text-foreground"
              : "ring-muted hover:bg-muted text-muted-foreground"
          )}
        >
          <RadioGroupPrimitive.Item
            id={opt.id}
            value={String(opt.value)}
            className="peer sr-only"
          />
          <label
            htmlFor={opt.id}
            className="mx-auto flex w-full cursor-pointer items-center justify-center text-sm font-medium transition-all duration-300"
          >
            {opt.label}
          </label>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}