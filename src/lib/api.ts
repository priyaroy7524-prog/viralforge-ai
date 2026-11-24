export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }
  const result: unknown = await response.json().catch(() => ({}));
  const data = result as { error?: string };
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return result as T;
}
