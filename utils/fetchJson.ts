export default async function fetchJson<JSON = unknown>(
  input: RequestInfo, init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  const data = await res.json();

  if (res.ok) return data;

  throw new Error(res.statusText);
}