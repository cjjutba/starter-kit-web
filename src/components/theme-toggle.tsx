"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

// Three way switch, light, system, dark. The stored theme is only known on the
// client, so a quiet placeholder renders until hydration and the server and
// client agree.

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

export function ThemeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return <div className={cn("h-9 w-30 rounded-pill bg-pill-2", className)} aria-hidden />;

  return (
    <div role="radiogroup" aria-label="Colour theme" className={cn("inline-flex h-9 items-center gap-0.5 rounded-pill bg-pill-2 p-0.5", className)}>
      {options.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "hit inline-flex h-8 items-center gap-1.5 rounded-pill px-2.5 text-label font-medium transition-colors duration-150 motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page",
              active ? "bg-page text-text" : "text-text-2 hover:text-text",
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} aria-hidden />
            {compact ? null : <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

// The same switch as a row inside the account menu: the word on the left, the
// three icons on the right. Choosing one keeps the menu open, because people
// compare light against dark before they settle.
export function ThemeMenuRow() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  return (
    <DropdownMenuPrimitive.RadioGroup
      value={mounted ? (theme ?? "system") : "system"}
      onValueChange={setTheme}
      aria-label="Colour theme"
      className="flex items-center justify-between gap-3 rounded-tag py-1.5 pl-3 pr-1.5"
    >
      <span className="text-small text-text">Appearance</span>
      <span className="flex items-center gap-0.5 rounded-pill bg-pill-2 p-0.5">
        {options.map(({ value, label, Icon }) => (
          <DropdownMenuPrimitive.RadioItem
            key={value}
            value={value}
            aria-label={label}
            onSelect={(event) => event.preventDefault()}
            className={cn(
              "hit grid size-7 cursor-pointer place-items-center rounded-full text-text-2 outline-none",
              "data-highlighted:text-text data-highlighted:ring-2 data-highlighted:ring-focus data-[state=checked]:bg-page data-[state=checked]:text-text",
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} aria-hidden />
          </DropdownMenuPrimitive.RadioItem>
        ))}
      </span>
    </DropdownMenuPrimitive.RadioGroup>
  );
}
