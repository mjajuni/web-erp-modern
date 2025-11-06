"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type Option<V = string> = { label: string; value: V };

export type Column<T> = {
  key: keyof T;
  header: string;
  width?: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: T) => React.ReactNode;
};

export type FilterDef<T> = {
  /** kolom yang ingin difilter */
  key: keyof T;
  /** label yang tampil di UI */
  label: string;
  /** daftar opsi filter; tambahkan "ALL" secara otomatis */
  options: Option[];
};

type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  filters?: FilterDef<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  searchKeys = [],
  filters = [],
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 5,
  onRowClick,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(filters.map((f) => [String(f.key), "ALL"])) as Record<
        string,
        string
      >
  );

  // handlings
  const clearFilters = () => {
    setActiveFilters(
      Object.fromEntries(filters.map((f) => [String(f.key), "ALL"])) as Record<
        string,
        string
      >
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    // 1) filter by dropdown
    const byDropdown = data.filter((row) =>
      filters.every((f) => {
        const k = String(f.key);
        const active = activeFilters[k] ?? "ALL";
        if (active === "ALL") return true;
        return String(row[f.key]) === active;
      })
    );

    // 2) filter by search
    if (!query.trim()) return byDropdown;
    const q = query.toLowerCase();
    return byDropdown.filter((row) =>
      (searchKeys.length ? searchKeys : (Object.keys(row) as (keyof T)[])).some(
        (key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(q)
      )
    );
  }, [data, filters, activeFilters, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 p-3">
        {title && (
          <h2 className="mr-auto text-sm font-semibold text-zinc-700">
            {title}
          </h2>
        )}

        {/* Filters */}
        {filters.map((f) => (
          <label key={String(f.key)} className="text-sm text-zinc-600">
            <span className="mr-2">{f.label}</span>
            <select
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm outline-none hover:border-zinc-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              value={activeFilters[String(f.key)] ?? "ALL"}
              onChange={(e) => {
                setActiveFilters((prev) => ({
                  ...prev,
                  [String(f.key)]: e.target.value,
                }));
                setPage(1);
              }}
            >
              <option value="ALL">All</option>
              {f.options.map((o) => (
                <option key={o.value} value={String(o.value)}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {filters.length > 0 && (
          <button
            onClick={clearFilters}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs hover:bg-zinc-50"
          >
            Reset
          </button>
        )}

        {/* Search */}
        <div className="relative w-56">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-1.5 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-zinc-50 text-left text-zinc-600">
              {columns.map((c, i) => (
                <th
                  key={String(c.key)}
                  className={`px-4 py-3 font-medium ${
                    i === 0 ? "rounded-tl-2xl" : ""
                  } ${i === columns.length - 1 ? "rounded-tr-2xl" : ""}`}
                  style={{ width: c.width }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-zinc-500"
                  colSpan={columns.length}
                >
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-zinc-100 transition hover:bg-zinc-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((c) => (
                    <td
                      key={String(c.key)}
                      className={`px-4 py-3 ${
                        c.align === "right"
                          ? "text-right"
                          : c.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {c.render
                        ? c.render(row[c.key], row)
                        : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 p-3 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm outline-none hover:border-zinc-300 focus:border-indigo-600"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="ml-2">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs ${
              currentPage === 1 ? "opacity-50" : "hover:bg-zinc-50"
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs text-zinc-500">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs ${
              currentPage === totalPages ? "opacity-50" : "hover:bg-zinc-50"
            }`}
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
