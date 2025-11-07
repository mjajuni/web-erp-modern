"use client";
import { ReactNode } from "react";
import clsx from "clsx";

type BaseProps = {
  label: string;
  editable?: boolean;
  className?: string;
};

// Mode A: pakai children (wrapper)
type SlotProps = BaseProps & {
  children: ReactNode;
  value?: never;
  onChange?: never;
  type?: never;
};

// Mode B: input terkontrol / read-only
type InputProps = BaseProps & {
  value?: string; // optional biar bisa di-readonly tanpa value awal
  onChange?: (v: string) => void;
  type?: "text" | "number" | "date";
  children?: never;
};

export type FieldProps = SlotProps | InputProps;

export default function Field(props: FieldProps) {
  const { label, editable = true } = props;

  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>

      {"children" in props ? (
        // Mode A: wrapper – render children apa adanya
        <div className="mt-1">{props.children}</div>
      ) : editable ? (
        // Mode B: input terkontrol
        <input
          type={props.type ?? "text"}
          value={props.value ?? ""}
          onChange={(e) => props.onChange?.(e.target.value)}
          className={clsx(
            "mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-zinc-400",
          )}
        />
      ) : (
        // Mode B: read-only display
        <div className="mt-0.5 text-sm text-zinc-900">{props.value ?? "—"}</div>
      )}
    </div>
  );
}
