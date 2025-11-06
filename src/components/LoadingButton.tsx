"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string; // jika diisi, tombol menjadi navigasi
  onClick?: () => Promise<any> | void; // aksi async custom
  disabled?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
  as?: "button" | "a"; // fallback jika mau pakai <a>
};

export default function LoadingButton({
  children,
  className,
  href,
  onClick,
  disabled,
  loadingText = "Memuat…",
  spinnerClassName = "size-4",
  as = "button",
}: Props) {
  const router = useRouter();
  const [pendingTransition, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const isLoading = loading || pendingTransition;

  const handleClick = async (e: React.MouseEvent) => {
    if (disabled || isLoading) return;

    // Navigasi
    if (href) {
      e.preventDefault();
      startTransition(() => {
        router.push(href);
      });
      return;
    }

    // Aksi custom
    if (onClick) {
      try {
        setLoading(true);
        await onClick();
      } finally {
        setLoading(false);
      }
    }
  };

  const Comp = as === "a" ? "a" : "button";

  return (
    <Comp
      href={href}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#272465]/40",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
    >
      {/* Konten / Loading */}
      {isLoading ? (
        <motion.span
          className="inline-flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            className={clsx("animate-spin", spinnerClassName)}
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="3"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {loadingText}
        </motion.span>
      ) : (
        children
      )}
    </Comp>
  );
}
