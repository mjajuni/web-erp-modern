export type ApprovalStage = "PEMOHON" | "PIHAK1" | "PIHAK2" | "BO" | "SELESAI";
export type ApprovalStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface ApprovalForm {
  id: number;
  pemohon: string;
  perusahaan: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  tanggal: string;
  tahap: ApprovalStage;
  status: ApprovalStatus;
  createdById: number;
  createdByName: string;
  createdByRole: string;
}

const STORAGE_KEY = "erp_approvals_list";

function load(): ApprovalForm[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(list: ApprovalForm[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const approvalsRepo = {
  /** Ambil semua data */
  getAll(): ApprovalForm[] {
    return load();
  },

  /** Cari berdasarkan ID */
  getById(id: number): ApprovalForm | undefined {
    return load().find((x) => x.id === id);
  },

  /** Tambah data baru */
  create(data: Omit<ApprovalForm, "id" | "tahap" | "status">): ApprovalForm {
    const list = load();
    const next: ApprovalForm = {
      id: Date.now(),
      tahap: "PEMOHON",
      status: "DRAFT",
      ...data,
    };
    list.unshift(next);
    save(list);
    return next;
  },

  /** Update data */
  update(id: number, patch: Partial<ApprovalForm>) {
    const list = load().map((x) => (x.id === id ? { ...x, ...patch } : x));
    save(list);
  },

  /** Hapus data */
  remove(id: number) {
    const list = load().filter((x) => x.id !== id);
    save(list);
  },

  /** Seed dummy data (untuk demo pertama kali) */
  seedIfEmpty() {
    const list = load();
    if (list.length) return;
    const dummy: ApprovalForm[] = [
      {
        id: 1,
        pemohon: "Yanuar Hadi Saputro",
        perusahaan: "PT Abdi Solusi Wisata",
        kategori: "Biaya Produksi / Cost Revenue",
        deskripsi: "Kebutuhan A, Kebutuhan B",
        nominal: 15000000,
        tanggal: "2025-04-18",
        tahap: "PIHAK1",
        status: "IN_REVIEW",
        createdById: 1,
        createdByName: "Yanuar Hadi Saputro",
        createdByRole: "PEMOHON",
      },
      {
        id: 2,
        pemohon: "Joko Admin",
        perusahaan: "PT Mitra Karya Digital",
        kategori: "Biaya Operasional",
        deskripsi: "Perjalanan Dinas",
        nominal: 7200000,
        tanggal: "2025-05-01",
        tahap: "BO",
        status: "APPROVED",
        createdById: 2,
        createdByName: "Joko Admin",
        createdByRole: "ADMIN",
      },
    ];
    save(dummy);
  },
};
