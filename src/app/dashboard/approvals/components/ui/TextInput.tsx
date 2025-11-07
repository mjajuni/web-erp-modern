"use client";
import { InputHTMLAttributes } from "react";

export default function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  const cls =
    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none " +
    "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition";
  return (
    <input {...props} className={props.className ? props.className : cls} />
  );
}
