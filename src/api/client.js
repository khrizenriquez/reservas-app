import { adaptRequest, adaptResponse } from "./adapters";
import { operationsByProfile } from "./operations.generated";
import { API_BASE_URL, API_PROFILE } from "./profile";
import { ApiProblem } from "./problem";

export function makeApiUrl(path, query) {
  const search = Object.entries(query || {}).filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&");
  return `${API_BASE_URL}${path}${search ? `?${search}` : ""}`;
}

async function readResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("json") ? response.json() : response.text();
}

export async function apiRequest(operationId, options = {}) {
  const operation = operationsByProfile[API_PROFILE][operationId];
  if (!operation) throw new Error(`Operation ${operationId} is not available for ${API_PROFILE}`);
  const path = typeof operation.path === "function" ? operation.path(options.pathParams || {}) : operation.path;
  const originalQuery = options.query || {};
  const prepared = adaptRequest(operationId, { ...options, profile: API_PROFILE });
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (prepared.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.accessToken) headers.set("Authorization", `Bearer ${options.accessToken}`);
  const response = await fetch(makeApiUrl(path, prepared.query), {
    method: operation.method, headers,
    body: prepared.body === undefined ? undefined : JSON.stringify(prepared.body), signal: options.signal,
  });
  const payload = await readResponse(response);
  if (!response.ok) throw new ApiProblem(
    typeof payload === "object" && payload !== null ? { ...payload, detail: payload.detail || payload.mensaje } : { detail: payload },
    response.status,
  );
  return adaptResponse(operationId, payload, { profile: API_PROFILE, originalQuery });
}
