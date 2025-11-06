"use client";
import RequireAuth from "../../../components/RequireAuth";
import Shell from "../../../components/Shell";
import { getRequest, submitRequest } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [r, setR] = useState<any>(null);

  useEffect(() => {
    getRequest(id).then(setR);
  }, [id]);

  async function submit() {
    await submitRequest(id);
    const updated = await getRequest(id);
    setR(updated);
  }

  return (
    <RequireAuth>
      <Shell>
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Request #{r?.requestNo ?? "-"}
            </h2>
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs">
              {r?.status}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Info label="Title" value={r?.title} />
            <Info
              label="Amount"
              value={r ? `Rp ${Number(r.amount).toLocaleString("id-ID")}` : "-"}
            />
            <Info label="Currency" value={r?.currency} />
            <Info label="Pre-Approval Ref" value={r?.preApprovalRef} />
            <Info label="CompanyID" value={r?.companyID} />
            <Info label="Current Step" value={r?.currentStep} />
            <div className="md:col-span-2">
              <div className="label">Description</div>
              <div className="text-sm">{r?.description ?? "-"}</div>
            </div>
          </div>

          {r?.status === "DRAFT" || r?.status === "NEEDS_REVISION" ? (
            <div className="pt-2">
              <button onClick={submit} className="btn-primary">
                Submit to PB1
              </button>
            </div>
          ) : null}
        </div>
      </Shell>
    </RequireAuth>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="text-sm">{value ?? "-"}</div>
    </div>
  );
}
