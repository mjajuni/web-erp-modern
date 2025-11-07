"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, FileX, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DataTable, { Column, FilterDef } from "../components/DataTable";
import RBACGuard from "./components/RBACGuard";
import { useAuth } from "./hooks/useAuth";

/* =========================
   Types & Constants
========================= */
type ApprovalStage = "Pemohon" | "Pihak 1" | "Pihak 2" | "BO" | "Selesai";
type ApprovalStatus =
  | "Draft"
  | "Submitted"
  | "In Review"
  | "Approved"
  | "Rejected";

interface ApprovalForm {
  id: string; // RequestNo/Code untuk ditampilkan
  backendId: string | number; // primary key untuk endpoint /api/requests/:id
  pemohon: string;
  perusahaan: string;
  nominal: number;
  tanggal: string; // yyyy-mm-dd
  tahap: ApprovalStage;
  status: ApprovalStatus;
  // field yang bisa diedit pada tahap DRAFT/NEEDS_REVISION oleh Pemohon
  preApprovalRef?: string;
  currency?: string;
  title?: string;
  description?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080";

/* =========================
   Helpers
========================= */
async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Map status backend -> tahap UI */
function stageFromStatus(status?: string): ApprovalStage {
  const x = String(status || "").toUpperCase();
  if (x === "UNDER_REVIEW_PB1") return "Pihak 1";
  if (x === "UNDER_REVIEW_PB2") return "Pihak 2";
  if (x === "UNDER_REVIEW_BO") return "BO";
  if (x === "NEEDS_REVISION") return "Pemohon"; // <- perbaikan utama
  if (x === "APPROVED_FINAL" || x === "APPROVED" || x === "REJECTED")
    return "Selesai";
  return "Pemohon";
}

function normalizeStatus(s?: string): ApprovalStatus {
  const x = String(s || "").toUpperCase();
  if (x === "DRAFT") return "Draft";
  if (x === "NEEDS_REVISION") return "Rejected"; // label UI utk revisi (tetap boleh edit)
  if (x === "SUBMITTED") return "Submitted";
  if (x.startsWith("UNDER_REVIEW_")) return "In Review";
  if (x === "APPROVED_FINAL" || x === "APPROVED") return "Approved";
  if (x === "REJECTED") return "Rejected";
  return "Draft";
}

function normalizeName(s?: string) {
  const n = String(s || "").trim();
  return n.replace(/\s+pemohon$/i, "").trim();
}

/** Ubah bentuk record backend -> ApprovalForm */
function transformToApproval(r: any): ApprovalForm {
  const backendId =
    r?.id ?? r?.ID ?? r?.requestId ?? r?.RequestID ?? r?.RequestId;
  const id =
    r?.RequestNo || r?.requestNo || r?.code || String(backendId ?? "—");

  const company =
    r?.CompanyName ||
    r?.Company?.Name ||
    r?.companyName ||
    r?.company ||
    r?.Perusahaan ||
    (r?.CompanyID ? `#${r.CompanyID}` : "—");

  const applicantRaw =
    r?.ApplicantName ||
    r?.Applicant?.Name ||
    r?.applicantName ||
    r?.applicant ||
    r?.Pemohon ||
    "—";

  const applicant = normalizeName(applicantRaw);

  const amount =
    typeof r?.Amount === "number"
      ? r.Amount
      : typeof r?.amount === "number"
      ? r.amount
      : Number(r?.Nominal ?? 0);

  const created =
    r?.CreatedAt ||
    r?.createdAt ||
    r?.tanggal ||
    r?.Date ||
    r?.date ||
    new Date().toISOString();

  const status = normalizeStatus(r?.Status || r?.status);
  const tahap = stageFromStatus(r?.Status || r?.status);

  const d = new Date(created);
  const tanggal = isNaN(d.getTime()) ? "—" : d.toISOString().slice(0, 10);

  return {
    id: String(id),
    backendId: backendId ?? id,
    pemohon: String(applicant),
    perusahaan: String(company),
    nominal: Number.isFinite(amount) ? amount : 0,
    tanggal,
    tahap,
    status,
    preApprovalRef: r?.PreApprovalRef || r?.preApprovalRef,
    currency: r?.Currency || r?.currency,
    title: r?.Title || r?.title,
    description: r?.Description || r?.description,
  };
}

/* =========================
   Page Component
========================= */
export default function ApprovalsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<ApprovalForm[]>([]);
  const [selected, setSelected] = useState<ApprovalForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const columns: Column<ApprovalForm>[] = [
    { key: "id", header: "ID Form" },
    { key: "pemohon", header: "Pemohon" },
    { key: "perusahaan", header: "Perusahaan" },
    { key: "tanggal", header: "Tanggal" },
    {
      key: "nominal",
      header: "Nominal (IDR)",
      align: "right",
      render: (v) => v.toLocaleString("id-ID"),
    },
    { key: "tahap", header: "Tahap", render: (v) => <StageBadge stage={v} /> },
    {
      key: "status",
      header: "Status",
      render: (v) => <StatusBadge status={v} />,
    },
  ];

  const filters: FilterDef<ApprovalForm>[] = [
    {
      key: "status",
      label: "Status",
      options: ["Draft", "Submitted", "In Review", "Approved", "Rejected"].map(
        (s) => ({
          label: s,
          value: s,
        })
      ),
    },
    {
      key: "tahap",
      label: "Tahap",
      options: ["Pemohon", "Pihak 1", "Pihak 2", "BO", "Selesai"].map((t) => ({
        label: t,
        value: t,
      })),
    },
  ];

  // ---- FETCH ----
  async function fetchApprovals() {
    setLoading(true);
    setErr("");
    try {
      const isApplicant = ["APPLICANT", "PEMOHON"].includes(
        String(user?.role || "").toUpperCase()
      );
      const url = isApplicant
        ? `${API_BASE}/api/requests/mine`
        : `${API_BASE}/api/requests/inbox`;

      const raw = await apiJson<any>(url, { method: "GET" });
      const list = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
      const mapped = list.map(transformToApproval);
      setData(mapped);
    } catch (e: any) {
      setErr(e?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchApprovals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ---- Stats dinamis ----
  const stats = useMemo(() => {
    const total = data.length;
    const approved = data.filter((x) => x.status === "Approved").length;
    const rejected = data.filter((x) => x.status === "Rejected").length;
    const pending = data.filter(
      (x) => x.status === "Submitted" || x.status === "In Review"
    ).length;
    return { total, approved, pending, rejected };
  }, [data]);

  if (!user)
    return (
      <div className="p-6 text-zinc-500 animate-pulse">Memuat user...</div>
    );

  return (
    <RBACGuard allow={["BO", "ADMIN", "APPLICANT", "PB1", "PB2"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <ol className="flex items-center gap-2 text-xs text-zinc-500">
              <li>Home</li>
              <li>›</li>
              <li>Dashboard</li>
              <li>›</li>
              <li className="text-zinc-700">Form Approval Transaksi</li>
            </ol>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
              Form Approval Transaksi Resmi
            </h1>
          </div>

          {["PEMOHON", "APPLICANT"].includes(
            String(user.role).toUpperCase()
          ) && (
            <button
              className="rounded-lg px-4 py-2 text-sm text-white shadow-sm hover:brightness-110"
              style={{ backgroundColor: "#272465" }}
              onClick={() => router.push("/dashboard/approvals/new")}
            >
              + Form Baru
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardStat
            label="Total Form"
            value={String(stats.total)}
            color="#272465"
            icon={Layers}
          />
          <CardStat
            label="Approved"
            value={String(stats.approved)}
            color="#16a34a"
            icon={CheckCircle2}
          />
          <CardStat
            label="Pending"
            value={String(stats.pending)}
            color="#f59e0b"
            icon={Clock}
          />
          <CardStat
            label="Rejected"
            value={String(stats.rejected)}
            color="#dc2626"
            icon={FileX}
          />
        </div>

        {/* Info */}
        <div className="text-sm text-zinc-500">
          {loading ? (
            "Memuat data…"
          ) : err ? (
            <span className="text-rose-600">{err}</span>
          ) : (
            ""
          )}
        </div>

        {/* Table */}
        <DataTable
          title="Daftar Form Approval"
          columns={columns}
          data={data}
          searchKeys={["id", "pemohon", "perusahaan"]}
          filters={filters}
          defaultPageSize={5}
          onRowClick={(row) => setSelected(row)}
        />

        {/* Drawer Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
            >
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setSelected(null)}
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl p-6 overflow-y-auto"
              >
                <DetailDrawer
                  form={selected}
                  onClose={() => {
                    setSelected(null);
                    fetchApprovals();
                  }}
                />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RBACGuard>
  );
}

/* =========================
   Detail Drawer
========================= */
function DetailDrawer({
  form: initial,
  onClose,
}: {
  form: ApprovalForm;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState(initial);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // helper setField (perbaikan utama)
  function setField<K extends keyof ApprovalForm>(
    key: K,
    value: ApprovalForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    setForm(initial);
    setEditMode(false);
    setError(null);
  }, [initial]);

  const role = String(user?.role || "").toUpperCase();
  const isApplicant = role === "PEMOHON" || role === "APPLICANT";

  // izinkan edit saat Draft atau Needs Revision (UI label: Rejected) di tahap Pemohon
  const canEditApplicant =
    isApplicant &&
    form.tahap === "Pemohon" &&
    (form.status === "Draft" || form.status === "Rejected");

  const canActPB1 =
    (role === "PB1" || role === "PIHAK1") && form.tahap === "Pihak 1";
  const canActPB2 =
    (role === "PB2" || role === "PIHAK2") && form.tahap === "Pihak 2";
  const canActBO = role === "BO" && form.tahap === "BO";

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        Title: form.title ?? undefined,
        Description: form.description ?? undefined,
        Currency: form.currency ?? undefined,
        PreApprovalRef: form.preApprovalRef ?? undefined,
        Amount: form.nominal,
      };
      const url = `${API_BASE}/api/requests/${form.backendId}`;
      const updated = await apiJson<any>(url, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const mapped = transformToApproval(updated?.data ?? updated);
      setForm(mapped);
      setEditMode(false);
    } catch (e: any) {
      setError(e.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    // hanya boleh submit saat di tahap Pemohon dan belum submitted
    if (
      !(
        form.tahap === "Pemohon" &&
        (form.status === "Draft" || form.status === "Rejected")
      )
    ) {
      alert("Hanya boleh submit saat tahap Pemohon (Draft/Needs Revision).");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/requests/${form.backendId}/submit`;
      await apiJson<any>(url, { method: "POST" });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        setForm((f) => ({ ...f, status: "In Review", tahap: "Pihak 1" }));
      }
      setEditMode(false);
      alert("Berhasil submit");
    } catch (e: any) {
      setError(e.message || "Gagal submit.");
    } finally {
      setSubmitting(false);
    }
  }

  // ====== ACTION PB1 ======
  async function handleApprovePB1() {
    if (!canActPB1) return;
    const ok = confirm("Setujui di tahap PB1?");
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/pb1/approve`;
      await apiJson<any>(url, { method: "POST" });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        setForm((f) => ({ ...f, tahap: "Pihak 2", status: "In Review" }));
      }
      alert("Disetujui oleh PB1.");
    } catch (e: any) {
      setError(e.message || "Gagal approve PB1.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRejectPB1() {
    if (!canActPB1) return;
    const note = prompt("Tolak di tahap PB1? Tambahkan alasan (opsional):", "");
    if (note === null) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/pb1/return`;
      await apiJson<any>(url, {
        method: "POST",
        body: JSON.stringify({ note }),
      });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        // fallback: Needs Revision -> kembali ke Pemohon
        setForm((f) => ({ ...f, status: "Rejected", tahap: "Pemohon" }));
      }
      alert("Ditolak oleh PB1.");
    } catch (e: any) {
      setError(e.message || "Gagal reject PB1.");
    } finally {
      setSaving(false);
    }
  }

  // ====== ACTION PB2 ======
  async function handleApprovePB2() {
    if (!canActPB2) return;
    const ok = confirm("Setujui di tahap PB2?");
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/pb2/approve`;
      await apiJson<any>(url, { method: "POST" });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        setForm((f) => ({ ...f, tahap: "BO", status: "In Review" }));
      }
      alert("Disetujui oleh PB2.");
    } catch (e: any) {
      setError(e.message || "Gagal approve PB2.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRejectPB2() {
    if (!canActPB2) return;
    const note = prompt("Tolak di tahap PB2? Tambahkan alasan (opsional):", "");
    if (note === null) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/pb2/return`;
      await apiJson<any>(url, {
        method: "POST",
        body: JSON.stringify({ note }),
      });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        setForm((f) => ({ ...f, status: "Rejected", tahap: "Pemohon" }));
      }
      alert("Ditolak oleh PB2.");
    } catch (e: any) {
      setError(e.message || "Gagal reject PB2.");
    } finally {
      setSaving(false);
    }
  }

  // ====== ACTION BO ======
  async function handleApproveBO() {
    if (!canActBO) return;
    const ok = confirm("Setujui di tahap BO?");
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/bo/approve`;
      await apiJson<any>(url, { method: "POST" });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        setForm((f) => ({ ...f, tahap: "Selesai", status: "Approved" }));
      }
      alert("Disetujui oleh BO.");
    } catch (e: any) {
      setError(e.message || "Gagal approve BO.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRejectBO() {
    if (!canActBO) return;
    const note = prompt("Tolak di tahap BO? Tambahkan alasan (opsional):", "");
    if (note === null) return;

    setSaving(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/approvals/${form.backendId}/bo/reject`;
      await apiJson<any>(url, {
        method: "POST",
        body: JSON.stringify({ note }),
      });

      try {
        const fresh = await apiJson<any>(
          `${API_BASE}/api/requests/${form.backendId}`,
          {
            method: "GET",
          }
        );
        setForm(transformToApproval(fresh?.data ?? fresh));
      } catch {
        // kalau backend betul-betul reject final, boleh selesai.
        // tapi jika “return for revision” via endpoint ini, sesuaikan sesuai implementasi backend.
        setForm((f) => ({ ...f, status: "Rejected", tahap: "Pemohon" }));
      }
      alert("Ditolak oleh BO.");
    } catch (e: any) {
      setError(e.message || "Gagal reject BO.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{form.id}</h2>
          <p className="text-xs text-zinc-500">
            Backend ID: {String(form.backendId)}
          </p>
          <p className="text-sm text-zinc-500">{form.perusahaan}</p>
        </div>
        <div className="flex gap-2">
          {canEditApplicant && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
          >
            Tutup
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* BODY */}
      <div className="grid grid-cols-2 gap-3">
        {/* Editable fields selaras backend */}
        <Field
          label="Judul"
          value={form.title ?? ""}
          editable={canEditApplicant && editMode}
          onChange={(v) => setField("title", v)}
        />
        <Field
          label="Currency"
          value={form.currency ?? "IDR"}
          editable={canEditApplicant && editMode}
          onChange={(v) => setField("currency", v)}
        />
        <Field
          label="Pre-Approval Ref"
          value={form.preApprovalRef ?? ""}
          editable={canEditApplicant && editMode}
          onChange={(v) => setField("preApprovalRef", v)}
        />
        <Field
          label="Nominal"
          value={String(form.nominal)}
          type="number"
          editable={canEditApplicant && editMode}
          onChange={(v) => setField("nominal", Number(v))}
        />
        <div className="col-span-2">
          <Field
            label="Deskripsi"
            value={form.description ?? ""}
            editable={canEditApplicant && editMode}
            onChange={(v) => setField("description", v)}
          />
        </div>

        {/* Readonly info */}
        <Info label="Pemohon" value={form.pemohon} />
        <Info label="Perusahaan" value={form.perusahaan} />
        <Info label="Tanggal Pengajuan" value={form.tanggal} />
        <Info label="Tahap Saat Ini" value={form.tahap} />
        <Info label="Status" value={form.status} />
      </div>

      <HistoryTimeline form={form} />

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap justify-end gap-2">
        {canEditApplicant && editMode && (
          <>
            <button
              disabled={saving}
              onClick={handleSave}
              className="rounded-lg px-3 py-2 text-sm text-white shadow-sm disabled:opacity-60"
              style={{ backgroundColor: "#272465" }}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              disabled={saving}
              onClick={() => {
                setEditMode(false);
                setError(null);
              }}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Batal
            </button>
          </>
        )}

        {canEditApplicant && !editMode && (
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110 disabled:opacity-60"
            style={{ backgroundColor: "#16a34a" }}
          >
            {submitting ? "Mengirim..." : "Submit"}
          </button>
        )}

        {canActPB1 && !editMode && (
          <>
            <button
              disabled={saving}
              onClick={handleApprovePB1}
              className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "#272465" }}
            >
              {saving ? "Memproses..." : "Setujui (PB1)"}
            </button>
            <button
              disabled={saving}
              onClick={handleRejectPB1}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Tolak (PB1)
            </button>
          </>
        )}

        {canActPB2 && !editMode && (
          <>
            <button
              disabled={saving}
              onClick={handleApprovePB2}
              className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "#272465" }}
            >
              {saving ? "Memproses..." : "Setujui (PB2)"}
            </button>
            <button
              disabled={saving}
              onClick={handleRejectPB2}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Tolak (PB2)
            </button>
          </>
        )}

        {canActBO && !editMode && (
          <>
            <button
              disabled={saving}
              onClick={handleApproveBO}
              className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "#272465" }}
            >
              {saving ? "Memproses..." : "Setujui (BO)"}
            </button>
            <button
              disabled={saving}
              onClick={handleRejectBO}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Tolak (BO)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   History Timeline (Simulation)
========================= */
function HistoryTimeline({ form }: { form: ApprovalForm }) {
  const items: Array<{
    label: string;
    tone: "info" | "success" | "warn" | "danger";
  }> = [];

  items.push({ label: `Dibuat oleh ${form.pemohon}`, tone: "info" });

  if (form.tahap !== "Pemohon") {
    items.push({ label: "Diajukan ke PB1", tone: "info" });
  }
  if (
    ["Pihak 2", "BO", "Selesai"].includes(form.tahap) &&
    form.status !== "Rejected"
  ) {
    items.push({ label: "Disetujui PB1", tone: "success" });
  }
  if (["BO", "Selesai"].includes(form.tahap) && form.status !== "Rejected") {
    items.push({ label: "Disetujui PB2", tone: "success" });
  }
  if (form.status === "Approved") {
    items.push({ label: "Final Approved (BO)", tone: "success" });
  }
  if (form.status === "Rejected" && form.tahap === "Pemohon") {
    items.push({
      label: "Perlu Revisi (Needs Revision) - Kembali ke Pemohon",
      tone: "danger",
    });
  } else if (form.status === "Rejected") {
    items.push({ label: "Perlu Revisi / Ditolak", tone: "danger" });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-zinc-800">
        Riwayat Proses
      </div>
      <ul className="space-y-3">
        {items.map((e, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={
                {
                  info: "bg-zinc-300",
                  success: "bg-green-500",
                  warn: "bg-amber-500",
                  danger: "bg-red-500",
                }[e.tone] + " mt-1 inline-block h-2.5 w-2.5 rounded-full"
              }
            />
            <div className="text-sm text-zinc-900">{e.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================
   Small Components
========================= */
function StageBadge({ stage }: { stage: ApprovalStage }) {
  const map: Record<ApprovalStage, string> = {
    Pemohon: "bg-sky-50 text-sky-700 border-sky-200",
    "Pihak 1": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Pihak 2": "bg-purple-50 text-purple-700 border-purple-200",
    BO: "bg-amber-50 text-amber-700 border-amber-200",
    Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[stage]}`}
    >
      {stage}
    </span>
  );
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, string> = {
    Draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Submitted: "bg-blue-50 text-blue-700 border-blue-200",
    "In Review": "bg-amber-50 text-amber-800 border-amber-200",
    Approved: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function CardStat({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div>
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="mt-1 text-2xl font-semibold" style={{ color }}>
          {value}
        </div>
      </div>
      <Icon className="h-6 w-6 opacity-70" style={{ color }} />
    </motion.div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-0.5 text-sm text-zinc-900">{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  editable,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  type?: "text" | "number" | "date";
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      {editable ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      ) : (
        <div className="mt-0.5 text-sm text-zinc-900">{value ?? "—"}</div>
      )}
    </div>
  );
}
