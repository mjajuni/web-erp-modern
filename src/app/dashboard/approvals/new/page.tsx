// src/app/dashboard/approvals/new/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* =========================
   Zod Schema & Types
========================= */
const FormSchema = z.object({
  Title: z.string().min(3, "Minimal 3 karakter"),
  Description: z.string().min(5, "Deskripsi terlalu singkat"),
  Currency: z.enum(["IDR", "USD"]),
  PreApprovalRef: z.string().trim().optional().nullable(),
  Amount: z
    .number() // tanpa invalid_type_error
    .refine(Number.isFinite, { message: "Nominal wajib angka" })
    .min(1, "Nominal harus > 0"),
  CompanyID: z
    .number() // tanpa invalid_type_error
    .refine(Number.isFinite, { message: "Pilih perusahaan" })
    .int()
    .min(1, "Wajib pilih perusahaan"),
});

type FormValues = z.infer<typeof FormSchema>;

/* =========================
   Page Component
========================= */
export default function PremiumRequestForm() {
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [companies] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: "PT Nusantara Sejahtera" },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Title: "",
      Description: "",
      Currency: "IDR",
      PreApprovalRef: "",
      Amount: 0,
      CompanyID: 1,
    },
    mode: "onChange",
  });

  const watchCurrency = form.watch("Currency"); // "IDR" | "USD"
  const watchAmount = form.watch("Amount"); // number

  const onSubmit = async (values: FormValues) => {
    setIsPosting(true);
    setNotice(null);
    try {
      const res = await fetch("http://localhost:8080/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());

      form.reset({
        Title: "",
        Description: "",
        Currency: "IDR",
        PreApprovalRef: "",
        Amount: 0,
        CompanyID: 1,
      });

      setNotice({
        type: "success",
        text: "Request berhasil dikirim ke backend.",
      });
      setTimeout(() => router.push("/dashboard/approvals"), 200);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Terjadi kesalahan koneksi";
      setNotice({ type: "error", text: message });
    } finally {
      setIsPosting(false);
    }
  };

  const formatCurrency = (num: number) => {
    const nf = new Intl.NumberFormat(
      watchCurrency === "USD" ? "en-US" : "id-ID",
    );
    return nf.format(num);
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative rounded-2xl border bg-white p-6 shadow-md">
          {isPosting && (
            <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400 opacity-80"
              />
            </div>
          )}

          <h1 className="mb-2 text-xl font-semibold">Form Permohonan</h1>
          <p className="mb-6 text-sm text-gray-500">
            Lengkapi informasi di bawah ini untuk mengajukan permohonan.
          </p>

          <Section title="Informasi Permohonan">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" error={form.formState.errors.Title?.message}>
                <input
                  className="input-bordered border border-gray-400"
                  {...form.register("Title")}
                  placeholder="Contoh: Pembelian Perlengkapan"
                />
              </Field>

              <Field label="Pre-Approval Ref (opsional)">
                <input
                  className="input-bordered border border-gray-400"
                  {...form.register("PreApprovalRef")}
                  placeholder="Memo-Direksi-001"
                />
              </Field>

              <Field
                label="Description"
                className="md:col-span-2"
                error={form.formState.errors.Description?.message}
              >
                <textarea
                  className="input-bordered min-h-[120px] border border-gray-400"
                  {...form.register("Description")}
                  placeholder="Jelaskan kebutuhan, vendor, dan catatan penting"
                />
              </Field>
            </div>
          </Section>

          <Section title="Rincian Finansial">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Currency">
                <select
                  className="input-bordered border border-gray-400"
                  {...form.register("Currency")}
                >
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                </select>
              </Field>

              <Field
                label="Amount"
                error={form.formState.errors.Amount?.message}
              >
                <input
                  type="number"
                  className="input-bordered border border-gray-400"
                  // penting: simpan sebagai number asli
                  {...form.register("Amount", { valueAsNumber: true })}
                  placeholder="300000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watchCurrency}: {formatCurrency(watchAmount ?? 0)}
                </p>
              </Field>

              <Field
                label="Company"
                error={form.formState.errors.CompanyID?.message}
              >
                <select
                  className="input-bordered border border-gray-400"
                  value={form.watch("CompanyID")}
                  onChange={(e) =>
                    form.setValue("CompanyID", Number(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={isPosting}
              className="btn-primary"
            >
              {isPosting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Kirim Form »"
              )}
            </button>
            <button
              type="button"
              onClick={() => form.reset()}
              disabled={isPosting}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>

          {/* Modal konfirmasi */}
          <AnimatePresence>
            {confirmOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                aria-modal
                role="dialog"
              >
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setConfirmOpen(false)}
                />
                <motion.div
                  initial={{ scale: 0.96, y: 8, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.98, y: 6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-xl"
                >
                  <h4 className="text-base font-semibold">
                    Konfirmasi Pengiriman
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Yakin ingin mengirim formulir ini?
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        setConfirmOpen(false);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      Ya, kirim sekarang
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 rounded-lg border p-4 ${
                  notice.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  {notice.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <CircleAlert className="h-4 w-4" />
                  )}
                  <span>{notice.text}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <aside className="lg:sticky lg:top-6">
        <div className="rounded-2xl border bg-white p-6 shadow-md">
          <h2 className="mb-3 text-base font-semibold">Ringkasan</h2>
          <SummaryRow label="Title" value={form.watch("Title") || "-"} />
          <SummaryRow
            label="Company"
            value={
              companies.find((c) => c.id === form.watch("CompanyID"))?.name ||
              "-"
            }
          />
          <SummaryRow label="Currency" value={watchCurrency} />
          <SummaryRow label="Amount" value={formatCurrency(watchAmount)} />
          <SummaryRow
            label="Pre-Approval"
            value={form.watch("PreApprovalRef") || "-"}
          />
        </div>

        <div className="mt-3 rounded-2xl border bg-white p-6 shadow-md">
          <h3 className="mb-2 text-sm font-semibold">Alur Persetujuan</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>👤 Pemohon</li>
            <li>🏢 PB1</li>
            <li>🏢 PB2</li>
            <li>🛡️ BO</li>
          </ul>
        </div>
      </aside>

      {/* quick styles for demo */}
      <style jsx global>
        {_styles}
      </style>
    </div>
  );
}

/* =========================
   Small UI Helpers
========================= */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <FileText className="h-4 w-4" /> {title}
      </h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between border-b border-gray-300 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{String(value)}</span>
    </div>
  );
}

/* =========================
   Inline styles (Tailwind helpers)
========================= */
const _styles = `
.input-bordered {@apply block w-full rounded-lg border border-gray-400 p-2.5 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200;}
.btn-primary {@apply rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50;}
.btn-secondary {@apply rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200 disabled:opacity-50;}
`;
