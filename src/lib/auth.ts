export type User = { id: number; name: string; email: string; role: string };

const KEY = "erp_token";
const USER_KEY = "erp_user";

export function saveAuth(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}
export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}
export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
}
