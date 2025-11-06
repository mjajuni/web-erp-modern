"use client";
import RequireAuth from "../../components/RequireAuth";
import Shell from "../../components/Shell";
import { getMine } from "../../lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyRequests() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    getMine().then(setRows);
  }, []);

  return (
    <RequireAuth>
      <Shell>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">My Requests</h2>
          <Link className="btn-primary" href="/requests/new">
            + New
          </Link>
        </div>
        <div className="card overflow-hidden">
          <table className="table">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="th px-4">No</th>
                <th className="th">Title</th>
                <th className="th">Amount</th>
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="td px-4">{r.requestNo}</td>
                  <td className="td">{r.title}</td>
                  <td className="td">
                    Rp {Number(r.amount).toLocaleString("id-ID")}
                  </td>
                  <td className="td">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs">
                      {r.status}
                    </span>
                  </td>
                  <td className="td">
                    <Link
                      className="btn-ghost text-xs"
                      href={`/requests/${r.id}`}
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="td p-6 text-center text-zinc-500" colSpan={5}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Shell>
    </RequireAuth>
  );
}
