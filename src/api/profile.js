const profile = process.env.EXPO_PUBLIC_API_PROFILE || "legacy";

if (!Object.hasOwn({ legacy: true, v2: true }, profile)) {
  throw new Error(`EXPO_PUBLIC_API_PROFILE must be legacy or v2, received: ${profile}`);
}

export const API_PROFILE = profile;
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || (
  profile === "v2" ? "http://localhost:8100" : "http://localhost:8000"
)).replace(/\/$/, "");
export const IS_LEGACY = profile === "legacy";
export const SESSION_NAMESPACE = `reservas.mobile.session.${profile}.${API_BASE_URL}`.replace(/[^A-Za-z0-9._-]/g, "_");
