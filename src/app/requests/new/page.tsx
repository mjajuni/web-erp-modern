"use client";

import RequireAuth from "../../../components/RequireAuth";
import Shell from "../../../components/Shell";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRequest } from "../../../lib/api";
import { useRouter } from "next/navigation";

const Schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  amount: z.coerce.number().positive(),
  currency: z.string().default("IDR"),
  preApprovalRef: z.string().min(1, "Wajib diisi"),
  companyID: z.coerce.number().int().positive(),
});
type Form = z.infer<typeof Schema>;

export default function NewRequestPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: { currency: "IDR", companyID: 1 },
  });
  const router = useRouter();

  async function onSubmit(data: Form) {
    const r = await createRequest(data);
    router.replace(`/requests/${r.id}`);
  }

  return (
    <RequireAuth>
      <Shell>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">New Request</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label className="label">Title</label>
              <input className="input" {...register("title")} />
              <p className="text-red-600 text-sm">{errors.title?.message}</p>
            </div>
            <div>
              <label className="label">Amount</label>
              <input
                className="input"
                type="number"
                step="0.01"
                {...register("amount")}
              />
              <p className="text-red-600 text-sm">{errors.amount?.message}</p>
            </div>
            <div>
              <label className="label">Currency</label>
              <input className="input" {...register("currency")} />
            </div>
            <div>
              <label className="label">Company ID</label>
              <input
                className="input"
                type="number"
                {...register("companyID")}
              />
              <p className="text-red-600 text-sm">
                {errors.companyID?.message}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="label">Pre-Approval Ref</label>
              <input
                className="input"
                placeholder="Memo-Direksi-001"
                {...register("preApprovalRef")}
              />
              <p className="text-red-600 text-sm">
                {errors.preApprovalRef?.message}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input min-h-[100px]"
                {...register("description")}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Shell>
    </RequireAuth>
  );
}
