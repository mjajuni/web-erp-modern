"use client";
import DataTable, { Column, FilterDef } from "../components/DataTable";
import RBACGuard from "../approvals/components/RBACGuard";
import { useAuth } from "../approvals/hooks/useAuth";

type Vendor = {
  id: string;
  name: string;
  category: string;
  contact: string;
  city: string;
  status: "Active" | "Inactive";
};

const data: Vendor[] = [
  {
    id: "VND-001",
    name: "PT Arunika",
    category: "Logistics",
    contact: "Rani Pratiwi",
    city: "Jakarta",
    status: "Active",
  },
  {
    id: "VND-002",
    name: "CV Prima Abadi",
    category: "Supplies",
    contact: "Sinta Rahma",
    city: "Bandung",
    status: "Active",
  },
  {
    id: "VND-003",
    name: "PT Nusantara Tech",
    category: "IT Services",
    contact: "Budi Santoso",
    city: "Surabaya",
    status: "Inactive",
  },
  {
    id: "VND-004",
    name: "PT Mega Jaya",
    category: "Construction",
    contact: "Andi Nugroho",
    city: "Medan",
    status: "Active",
  },
  {
    id: "VND-005",
    name: "CV Indotek",
    category: "Hardware",
    contact: "Putra Wijaya",
    city: "Malang",
    status: "Inactive",
  },
];

export default function VendorsPage() {
  const { user } = useAuth();

  const columns: Column<Vendor>[] = [
    { key: "id", header: "ID Vendor" },
    { key: "name", header: "Vendor Name" },
    { key: "category", header: "Category" },
    { key: "contact", header: "Contact" },
    { key: "city", header: "City" },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs border font-medium ${
            v === "Active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {v}
        </span>
      ),
    },
  ];

  const filters: FilterDef<Vendor>[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
    {
      key: "city",
      label: "City",
      options: [...new Set(data.map((d) => d.city))].map((c) => ({
        label: c,
        value: c,
      })),
    },
  ];

  return (
    <RBACGuard allow={["ADMIN", "PB1", "PB2", "APPLICANT"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Vendors Management
        </h1>
        <DataTable
          title="Daftar Vendor Terdaftar"
          columns={columns}
          data={data}
          searchKeys={["name", "category", "contact", "city"]}
          filters={filters}
          defaultPageSize={5}
        />
      </div>
    </RBACGuard>
  );
}
