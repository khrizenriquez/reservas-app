import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createRenderApiClient } from "../api/renderApi";

const SESSION_KEY = "reservas-ui-identity-v1";
const SessionContext = createContext(null);

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

export function normalizeIdentity(value) {
  if (!value || typeof value !== "object") return null;

  const id = asNumber(value.id ?? value.UMG_ID ?? value.umg_id);
  const email = String(value.email ?? value.username ?? value.UMG_Usuario ?? value.umg_usuario ?? "").trim();
  if (!id || !email) return null;

  const firstName = String(value.name ?? value.UMG_Nombre ?? value.umg_nombre ?? "").trim();
  const lastName = String(value.lastName ?? value.UMG_Apellido ?? value.umg_apellido ?? "").trim();
  const roleValue = value.role;
  const role = roleValue && typeof roleValue === "object" ? roleValue : { name: roleValue };
  const roleId = asNumber(role.id ?? value.roleId ?? value.UMG_Rol_ID ?? value.umg_rol_id);
  const roleName = String(role.name ?? value.roleName ?? value.UMG_Rol_Nombre ?? value.umg_rol_nombre ?? "").trim();

  return {
    id,
    name: [firstName, lastName].filter(Boolean).join(" ") || "Usuario UMG",
    email,
    role: { id: roleId, name: roleName }
  };
}

export const isAdminIdentity = (identity) => identity?.role?.id === 1 || /admin/i.test(identity?.role?.name ?? "");

export function navigationFor(identity) {
  const shared = [
    { key: "home", href: "/portal" },
    { key: "availability", href: "/portal/availability" },
    { key: "reservations", href: "/portal/reservations" },
    { key: "administration", href: "/portal/administration" },
    { key: "profile", href: "/portal/profile" }
  ];
  return isAdminIdentity(identity)
    ? [...shared, { key: "users", href: "/portal/users" }, { key: "logs", href: "/portal/logs" }]
    : shared;
}

const identitiesFrom = (response) => (Array.isArray(response) ? response : [response])
  .map(normalizeIdentity)
  .filter(Boolean);

export function SessionProvider({ children, apiFactory = createRenderApiClient, storage = SecureStore }) {
  const [identity, setIdentity] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    const restore = async () => {
      try {
        const stored = await storage.getItemAsync(SESSION_KEY);
        const restored = stored ? normalizeIdentity(JSON.parse(stored)) : null;
        if (isActive) setIdentity(restored);
      } catch {
        if (isActive) setIdentity(null);
      } finally {
        if (isActive) setIsReady(true);
      }
    };
    restore();
    return () => { isActive = false; };
  }, [storage]);

  const signIn = useCallback(async ({ username, password }) => {
    const api = apiFactory();
    const loginResponse = await api.login({ username, password });
    let nextIdentity = identitiesFrom(loginResponse)[0] ?? null;

    if (!nextIdentity) {
      const expectedEmail = String(username).trim().toLowerCase();
      const users = await api.listUsers();
      nextIdentity = identitiesFrom(users).find((user) => user.email.toLowerCase() === expectedEmail) ?? null;
    }
    if (!nextIdentity) throw new Error("session.identityMissing");

    await storage.setItemAsync(SESSION_KEY, JSON.stringify(nextIdentity));
    setIdentity(nextIdentity);
    return nextIdentity;
  }, [apiFactory, storage]);

  const signOut = useCallback(async () => {
    await storage.deleteItemAsync(SESSION_KEY);
    setIdentity(null);
  }, [storage]);

  const value = useMemo(() => ({
    identity,
    isReady,
    isAdmin: isAdminIdentity(identity),
    navigation: navigationFor(identity),
    signIn,
    signOut
  }), [identity, isReady, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("SessionProvider is required");
  return value;
}
