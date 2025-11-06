"use client";

import Aurora from "@/components/Aurora";

export default function BackgroundPremium() {
  return (
    <>
      {/* Lapisan 1: base gradient lembut */}
      <div className="pointer-events-none fixed inset-0 -z-30 bg-[linear-gradient(120deg,#f7f8fc_0%,#eef1f8_45%,#e7ecf7_100%)]" />

      {/* Lapisan 2: vignette & glow tepi */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(39,36,101,0.08)_0%,transparent_60%)]" />

      {/* Lapisan 3: conic highlight premium */}
      <div
        className="pointer-events-none fixed -top-1/3 left-1/2 -z-10 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[50%] opacity-[0.45] blur-3xl will-change-transform animate-slow-pan
        bg-[conic-gradient(from_220deg_at_50%_50%,rgba(238,44,115,0.20),rgba(255,205,5,0.12),rgba(39,36,101,0.22),rgba(238,44,115,0.20))]"
      />

      {/* Lapisan 4: micro grid overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] mix-blend-overlay mask-[radial-gradient(85%_60%_at_50%_30%,#000,transparent_80%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[18px_18px]" />
      </div>

      {/* Lapisan 5: grain/noise halus */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.07] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>')]" />

      {/* Lapisan 6: Aurora natural tanpa garis bawah */}
      <div className="pointer-events-none fixed left-0 right-0 top-10 z-0 h-[220px] overflow-hidden">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          amplitude={1.75}
          blend={1}
          speed={0.55}
        />
      </div>
    </>
  );
}
