"use client";

import BackgroundPremium from "@/components/BackgroundPremium";
import Footer from "@/components/Footer";
import LoadingButton from "@/components/LoadingButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import MagicBento from "@/components/MagicBento";
import TextType from "@/components/TextType";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={isLoading} />
      <div className="relative min-h-dvh w-full overflow-x-hidden font-sans text-zinc-800 flex flex-col">
        {/* === THEME BACKGROUND PREMIUM === */}
        <BackgroundPremium />

        {/* NAVBAR (glass) */}
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 top-0 z-30 h-16 border-b border-white/40 bg-white/50 backdrop-blur-xl shadow-[0_6px_30px_rgba(39,36,101,0.06)]"
        >
          <div className="mx-auto max-w-7xl flex h-full items-center justify-between px-4 sm:px-6">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="ERP Console Home"
            >
              <div className="grid size-10 place-items-center rounded-2xl bg-[#272465] text-white font-semibold shadow-sm">
                ER
              </div>
              <div className="leading-none">
                <p className="text-base font-semibold text-[#272465]">
                  ERP Console
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Enterprise Resource Platform
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3 text-sm">
              <LoadingButton
                href="/login"
                className="group overflow-hidden bg-[#272465] text-white shadow-[0_6px_20px_rgba(39,36,101,0.35)] hover:shadow-[0_10px_30px_rgba(39,36,101,0.45)] active:scale-95 rounded-xl"
                loadingText="Membuka…"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowRight className="size-4 -rotate-180 opacity-80 transition-transform group-hover:translate-x-1 group-hover:rotate-0" />
                  Sign In
                </span>
              </LoadingButton>

              <LoadingButton
                href="/dashboard/overview"
                className="group overflow-hidden text-white active:scale-95 rounded-xl
               shadow-[0_6px_20px_rgba(238,44,115,0.30)]
               bg-[conic-gradient(from_240deg_at_50%_50%,#EE2C73_0deg,#FFCD05_120deg,#EE2C73_240deg,#FFCD05_360deg)] animate-slow-pan"
                loadingText="Menuju Dashboard…"
              >
                <span className="relative z-10">Sign Up</span>
              </LoadingButton>
            </div>
          </div>
        </nav>

        {/* Spacer untuk navbar fixed */}
        <div className="h-16 shrink-0" />

        {/* MAIN */}
        <main id="content" className="relative z-10 flex-1">
          {/* HERO */}
          <header className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24">
            <div className="relative z-20 max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900">
                The{" "}
                <span className="text-[#272465]">
                  <TextType
                    text={[
                      "Next-Gen ERP",
                      "Enterprise System",
                      "Digital Solution",
                    ]}
                    typingSpeed={100}
                    deletingSpeed={125}
                    pauseDuration={1500}
                    initialDelay={150}
                    variableSpeed={{ min: 75, max: 120 }}
                    showCursor
                    hideCursorWhileTyping={false}
                    cursorCharacter="|"
                    cursorBlinkDuration={0.9}
                    cursorClassName="text-[#272465] opacity-80"
                    className="whitespace-pre"
                    loop
                  />
                </span>{" "}
                Experience
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
                Platform modern untuk mengelola seluruh proses bisnis Anda —
                pengajuan, persetujuan, inventori, hingga laporan keuangan.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#272465] px-6 py-3 text-white font-medium shadow transition hover:brightness-110 active:scale-[0.98]"
                  aria-label="Get started"
                >
                  <ArrowRight className="size-5 -rotate-180" />
                  Get Started
                </Link>
                <LoadingButton
                  as="a"
                  onClick={async () => {
                    // contoh aksi: scroll ke #features (pakai smooth scroll)
                    document
                      .querySelector("#features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-zinc-300/70 bg-white/70 text-zinc-700 rounded-xl backdrop-blur-md hover:bg-white"
                  loadingText="Menggulir…"
                >
                  Learn More
                </LoadingButton>
              </div>
            </div>
          </header>

          {/* FEATURES */}
          <section
            id="features"
            aria-labelledby="features-title"
            className="py-16 sm:py-24"
          >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <h2 id="features-title" className="sr-only">
                Fitur Unggulan
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <MagicBento
                  textAutoHide
                  enableStars
                  enableSpotlight
                  enableBorderGlow
                  enableTilt
                  enableMagnetism
                  clickEffect
                  spotlightRadius={300}
                  particleCount={14}
                  glowColor="132,0,255"
                />
              </motion.div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
