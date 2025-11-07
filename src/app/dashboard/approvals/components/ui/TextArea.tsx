"use client";
import { TextareaHTMLAttributes } from "react";

export default function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const cls =
    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none " +
    "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition";
  return (
    <textarea {...props} className={props.className ? props.className : cls} />
  );
}
