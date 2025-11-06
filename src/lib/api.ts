const BASE = process.env.NEXT_PUBLIC_API_BASE!;

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("erp_token") : null;
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type LoginReq = { email: string; password: string };
export function login(body: LoginReq) {
  return apiFetch<{ token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const getMe = () => apiFetch<any>("/me");
export const getMine = () => apiFetch<any[]>("/requests/mine");
export const getInbox = () => apiFetch<any[]>("/requests/inbox");
export const getRequest = (id: string | number) =>
  apiFetch<any>(`/requests/${id}`);
export const createRequest = (body: any) =>
  apiFetch<any>("/requests", { method: "POST", body: JSON.stringify(body) });
export const updateRequest = (id: string | number, body: any) =>
  apiFetch<any>(`/requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const submitRequest = (id: string | number) =>
  apiFetch<any>(`/requests/${id}/submit`, { method: "POST" });
