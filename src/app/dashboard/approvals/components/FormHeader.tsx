"use client";
import Field from "./ui/Field";
import TextInput from "./ui/TextInput";

export type HeaderState = {
  pemohon: string;
  perusahaan: string;
  tanggal: string;
};

export default function FormHeader({
  value,
  onChange,
}: {
  value: HeaderState;
  onChange: (patch: Partial<HeaderState>) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-800 mb-4">
        Identitas Pemohon
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Lengkap">
          <TextInput
            required
            placeholder="Andik Vermansyah"
            value={value.pemohon}
            onChange={(e) => onChange({ pemohon: e.target.value })}
          />
        </Field>
        <Field label="Nama Perusahaan">
          <TextInput
            required
            placeholder="Misal: PT Abdi Solusi Wisata"
            value={value.perusahaan}
            onChange={(e) => onChange({ perusahaan: e.target.value })}
          />
        </Field>
        <Field label="Tanggal Pengajuan">
          <TextInput
            type="date"
            required
            value={value.tanggal}
            onChange={(e) => onChange({ tanggal: e.target.value })}
          />
        </Field>
      </div>
    </section>
  );
}
