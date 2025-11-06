"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable, { Column, FilterDef } from "../components/DataTable";
import { useAuth } from "./hooks/useAuth";
import RBACGuard from "./components/RBACGuard";
import { CheckCircle2, Clock, FileX, Layers } from "lucide-react";

// ------- Types -------
type ApprovalStage = "Pemohon" | "Pihak 1" | "Pihak 2" | "BO" | "Selesai";
type ApprovalStatus =
  | "Draft"
  | "Submitted"
  | "In Review"
  | "Approved"
  | "Rejected";

interface ApprovalForm {
  id: string;
  pemohon: string;
  perusahaan: string;
  nominal: number;
  tanggal: string;
  tahap: ApprovalStage;
  status: ApprovalStatus;
}

// ------- Dummy Data -------
const dummyApprovals: ApprovalForm[] = [
  {
    id: "APP-2025-0001",
    pemohon: "Rani Pratiwi",
    perusahaan: "PT Arunika",
    nominal: 185000000,
    tanggal: "2025-11-02",
    tahap: "Pihak 2",
    status: "In Review",
  },
  {
    id: "APP-2025-0002",
    pemohon: "Andi Nugroho",
    perusahaan: "PT Mega Jaya",
    nominal: 45200000,
    tanggal: "2025-11-01",
    tahap: "BO",
    status: "Submitted",
  },
  {
    id: "APP-2025-0003",
    pemohon: "Budi Santoso",
    perusahaan: "PT Nusantara Tech",
    nominal: 9650000,
    tanggal: "2025-11-01",
    tahap: "Selesai",
    status: "Approved",
  },
  {
    id: "APP-2025-0004",
    pemohon: "Sinta Rahma",
    perusahaan: "CV Prima Abadi",
    nominal: 12800000,
    tanggal: "2025-11-02",
    tahap: "Pihak 1",
    status: "Draft",
  },
];

// ------- Main Component -------
export default function ApprovalsPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<ApprovalForm | null>(null);

  if (!user)
    return (
      <div className="p-6 text-zinc-500 animate-pulse">Memuat user...</div>
    );

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
    {
      key: "tahap",
      header: "Tahap",
      render: (v) => <StageBadge stage={v} />,
    },
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
        (s) => ({ label: s, value: s })
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

  return (
    <RBACGuard allow={["PEMOHON", "PIHAK1", "PIHAK2", "BO", "ADMIN"]}>
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
          {user.role === "PEMOHON" && (
            <button
              className="rounded-lg px-4 py-2 text-sm text-white shadow-sm hover:brightness-110"
              style={{ backgroundColor: "#272465" }}
            >
              + Form Baru
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardStat
            label="Total Form"
            value="4"
            color="#272465"
            icon={Layers}
          />
          <CardStat
            label="Approved"
            value="1"
            color="#16a34a"
            icon={CheckCircle2}
          />
          <CardStat label="Pending" value="2" color="#f59e0b" icon={Clock} />
          <CardStat label="Rejected" value="1" color="#dc2626" icon={FileX} />
        </div>

        {/* Table */}
        <DataTable
          title="Daftar Form Approval"
          columns={columns}
          data={dummyApprovals}
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
                  onClose={() => setSelected(null)}
                />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RBACGuard>
  );
}

// ------- Small Components -------
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
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status]}`}
    >
      {status}
    </span>
  );
}

function DetailDrawer({
  form,
  onClose,
}: {
  form: ApprovalForm;
  onClose: () => void;
}) {
  const { user } = useAuth();

  const canApprove =
    (user?.role === "PIHAK1" && form.tahap === "Pihak 1") ||
    (user?.role === "PIHAK2" && form.tahap === "Pihak 2") ||
    (user?.role === "BO" && form.tahap === "BO") ||
    user?.role === "ADMIN";

  const canEdit = user?.role === "PEMOHON" && form.tahap === "Pemohon";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{form.id}</h2>
          <p className="text-sm text-zinc-500">{form.perusahaan}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Tutup
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Info label="Pemohon" value={form.pemohon} />
        <Info label="Perusahaan" value={form.perusahaan} />
        <Info label="Tanggal Pengajuan" value={form.tanggal} />
        <Info
          label="Nominal"
          value={`IDR ${form.nominal.toLocaleString("id-ID")}`}
        />
        <Info label="Tahap Saat Ini" value={form.tahap} />
        <Info label="Status" value={form.status} />
      </div>

      <div className="flex justify-end gap-2">
        {canEdit && (
          <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50">
            Edit Form
          </button>
        )}
        {canApprove && (
          <>
            <button className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50">
              Tolak
            </button>
            <button
              className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110"
              style={{ backgroundColor: "#272465" }}
            >
              Setujui
            </button>
          </>
        )}
      </div>
    </div>
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
