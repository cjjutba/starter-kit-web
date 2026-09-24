"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// A field owns its label, control, helper line and error together, so no
// screen can ship an input without a label. DESIGN.md: an input is always one
// step of tone away from what it sits on. On a sheet it is --field, on the
// page it is --sheet. Never a border. Errors are a red ring and one red line.

type Surface = "sheet" | "page";

const surfaceFill: Record<Surface, string> = {
  sheet: "bg-field",
  page: "bg-sheet",
};

interface FieldFrameProps {
  label: string;
  helper?: ReactNode;
  error?: string;
  /** What the field sits on. Defaults to a sheet. */
  on?: Surface;
  /** Text shown after the label, e.g. "Optional". */
  hint?: string;
  className?: string;
  id: string;
  children: ReactNode;
}

function FieldFrame({ label, helper, error, hint, className, id, children }: FieldFrameProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-label font-medium text-text">
        <span>{label}</span>
        {hint ? <span className="font-normal text-text-2">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-label text-error">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-label text-text-2">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export const controlClass = (on: Surface, error?: boolean, extra?: string) =>
  cn(
    "w-full rounded-input px-4 text-body text-text placeholder:text-text-3",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sheet",
    surfaceFill[on],
    error ? "ring-2 ring-error focus-visible:ring-error" : "focus-visible:ring-focus",
    "disabled:opacity-60",
    extra,
  );

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  helper?: ReactNode;
  error?: string;
  hint?: string;
  on?: Surface;
  /** A fixed prefix inside the control, e.g. a URL stem. */
  prefix?: string;
  wrapperClassName?: string;
  id?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, helper, error, hint, on = "sheet", prefix, className, wrapperClassName, id: givenId, type, ...props },
  ref,
) {
  const auto = useId();
  const id = givenId ?? auto;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;

  const input = (
    <input
      ref={ref}
      id={id}
      type={isPassword ? (reveal ? "text" : "password") : type}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(controlClass(on, !!error, "h-input"), prefix && "rounded-l-none pl-0", isPassword && "pr-12", className)}
      {...props}
    />
  );

  return (
    <FieldFrame label={label} helper={helper} error={error} hint={hint} on={on} id={id} className={wrapperClassName}>
      {prefix || isPassword ? (
        <div className={cn("relative flex items-stretch rounded-input", error && "ring-2 ring-error", surfaceFill[on])}>
          {prefix ? (
            <span className="flex items-center pl-4 pr-1 text-body text-text-2 select-none" aria-hidden>
              {prefix}
            </span>
          ) : null}
          <input
            ref={ref}
            id={id}
            type={isPassword ? (reveal ? "text" : "password") : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "h-input w-full min-w-0 bg-transparent text-body text-text placeholder:text-text-3 focus:outline-none rounded-input",
              "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-sheet",
              prefix ? "pl-0 pr-4" : "px-4",
              isPassword && "pr-12",
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
              aria-pressed={reveal}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-input text-text-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {reveal ? <EyeOff className="size-5" strokeWidth={1.5} /> : <Eye className="size-5" strokeWidth={1.5} />}
            </button>
          ) : null}
        </div>
      ) : (
        input
      )}
    </FieldFrame>
  );
});

export interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  helper?: ReactNode;
  error?: string;
  hint?: string;
  on?: Surface;
  wrapperClassName?: string;
  id?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, helper, error, hint, on = "sheet", className, wrapperClassName, id: givenId, rows = 4, ...props },
  ref,
) {
  const auto = useId();
  const id = givenId ?? auto;
  return (
    <FieldFrame label={label} helper={helper} error={error} hint={hint} on={on} id={id} className={wrapperClassName}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(controlClass(on, !!error, "py-3 resize-y"), className)}
        {...props}
      />
    </FieldFrame>
  );
});

export interface SelectFieldProps {
  label: string;
  helper?: ReactNode;
  error?: string;
  hint?: string;
  on?: Surface;
  id?: string;
  /** Posted with the form. Pair with defaultValue for a server action form. */
  name?: string;
  /** Controlled, with onChange. Leave both out for a server action form. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function SelectField({
  label,
  helper,
  error,
  hint,
  on = "sheet",
  id: givenId,
  name,
  value,
  defaultValue,
  onChange,
  options,
  className,
  disabled,
  required,
}: SelectFieldProps) {
  const auto = useId();
  const id = givenId ?? auto;
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) } : { defaultValue };
  return (
    <FieldFrame label={label} helper={helper} error={error} hint={hint} on={on} id={id} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          className={cn(controlClass(on, !!error, "h-input appearance-none pr-10"))}
          {...controlled}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-2"
        />
      </div>
    </FieldFrame>
  );
}

export { FieldFrame };
