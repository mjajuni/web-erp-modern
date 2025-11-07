"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MapPin, Monitor, Clock } from "lucide-react";

// Util kecil: deteksi OS & browser singkat
function getOsAndBrowser(ua: string) {
  let os = "Unknown";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os|macintosh/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  const m = ua.match(
    /(Chrome|Safari|Firefox|Edg|Edge|Brave|Opera|OPR|SamsungBrowser)\/([\d.]+)/,
  );
  let browser = "Browser";
  if (m) {
    const map: Record<string, string> = { Edg: "Edge", OPR: "Opera" };
    browser = map[m[1]] || m[1];
  }
  return { os, browser };
}

export default function Footer() {
  const [locationInfo, setLocationInfo] = useState("Mendeteksi lokasi...");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [timeInfo, setTimeInfo] = useState("");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // === Lokasi: ipapi -> ipwho.is ===
    (async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        if (r.ok) {
          const d = await r.json();
          if (d?.city && d?.country_name) {
            setLocationInfo(`${d.city}, ${d.country_name}`);
            return;
          }
        }
      } catch {}
      try {
        const r2 = await fetch("https://ipwho.is/");
        if (r2.ok) {
          const d2 = await r2.json();
          if (d2?.success && d2?.city && d2?.country) {
            setLocationInfo(`${d2.city}, ${d2.country}`);
            return;
          }
        }
      } catch {}
      setLocationInfo("Lokasi tidak terdeteksi");
    })();

    // === Device singkat ===
    const ua = navigator.userAgent;
    const { os, browser } = getOsAndBrowser(ua);
    const storedName =
      (typeof window !== "undefined" && localStorage.getItem("userName")) || "";
    // Nama akun (opsional) — ganti default "N" bila perlu
    const name = storedName || "N";
    setDeviceInfo(`${name} • ${os} • ${browser}`);

    // === Clock ===
    const tick = () => {
      const now = new Date();
      setTimeInfo(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }),
      );
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <footer className="relative z-10 mt-auto border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
      {/* Bar atas */}
      <motion.div
        className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Kiri */}
        <div className="flex items-center gap-3">
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    boxShadow: [
                      "0 0 4px rgba(16,185,129,0.20)",
                      "0 0 12px rgba(16,185,129,0.50)",
                      "0 0 4px rgba(16,185,129,0.20)",
                    ],
                  }
            }
            transition={{ duration: 3, repeat: Infinity }}
          >
            <CheckCircle2 className="size-3 text-emerald-500" />
            System OK
          </motion.span>

          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">ERP Console</span>. All Rights
            Reserved.
          </p>
        </div>

        {/* Kanan */}
        <motion.p
          className="text-[11px]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Built with ❤️ by{" "}
          <span className="font-semibold text-[#272465] dark:text-indigo-300">
            @CodeWithJuni
          </span>
        </motion.p>
      </motion.div>

      {/* Bar bawah */}
      <div className="mx-auto max-w-7xl px-6 pb-5 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <motion.div
          className="flex items-center gap-1.5"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <MapPin className="size-3 text-[#272465]" />
          <span>{locationInfo}</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Clock className="size-3 text-[#EE2C73]" />
          {/* typewriter-ish: remount span tiap detik via key */}
          <motion.span
            key={timeInfo}
            className="font-mono text-zinc-700 dark:text-zinc-200"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {timeInfo} WIB
          </motion.span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 truncate"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Monitor className="size-3 text-[#FFCD05]" />
          <span className="truncate">{deviceInfo}</span>
        </motion.div>
      </div>
    </footer>
  );
}
