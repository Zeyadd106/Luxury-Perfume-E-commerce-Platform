import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full border-b bg-transparent px-0 py-3 text-[0.9375rem] font-light text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(fieldBase, "border-ink/20", invalid && "border-red-700", className)}
        {...props}
      />
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={5}
        className={cn(fieldBase, "resize-none border-ink/20", invalid && "border-red-700", className)}
        {...props}
      />
    );
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  function Select({ className, children, invalid, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(fieldBase, "border-ink/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23888%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0_center] bg-no-repeat pr-6", invalid && "border-red-700", className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);

export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="eyebrow mb-1 block text-ink/50">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
