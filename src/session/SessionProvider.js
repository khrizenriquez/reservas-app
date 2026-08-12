import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "../api/client";
import { API_PROFILE, IS_LEGACY } from "../api/profile";
import { secureSessionStore } from "./secure-store";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState({ status: "booting", user: null });
  const tokensRef = useRef({ accessToken: null, refreshToken: null });
  const refreshPromiseRef = useRef(null);

  const clearSession = useCallback(async () => {
    tokensRef.current = { accessToken: null, refreshToken: null };
    await secureSessionStore.clearSession();
    setSession({ status: "anonymous", user: null });
  }, []);

  const saveLegacy = useCallback(async (user) => {
    await secureSessionStore.setSession({ user });
    setSession({ status: "authenticated", user });
    return user;
  }, []);

  const saveV2 = useCallback(async (pair, user) => {
    tokensRef.current = { accessToken: pair.accessToken, refreshToken: pair.refreshToken };
    await secureSessionStore.setSession(tokensRef.current);
    setSession({ status: "authenticated", user });
    return user;
  }, []);

  const refresh = useCallback(() => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = (async () => {
        const refreshToken = tokensRef.current.refreshToken;
        if (!refreshToken) throw new Error("No refresh token is available");
        const pair = await apiRequest("refreshSession", { body: { refreshToken } });
        const user = await apiRequest("getCurrentUser", { accessToken: pair.accessToken });
        return saveV2(pair, user);
      })().finally(() => { refreshPromiseRef.current = null; });
    }
    return refreshPromiseRef.current;
  }, [saveV2]);

  useEffect(() => {
    let active = true;
    secureSessionStore.getSession().then(async (stored) => {
      if (!active) return;
      if (IS_LEGACY) {
        if (stored?.user) await saveLegacy(stored.user); else await clearSession();
      } else if (stored?.refreshToken) {
        tokensRef.current = stored;
        try { await refresh(); } catch { await clearSession(); }
      } else await clearSession();
    }).catch(clearSession);
    return () => { active = false; };
  }, [clearSession, refresh, saveLegacy]);

  const login = useCallback(async ({ username, password }) => {
    const result = await apiRequest("login", { body: { username, password } });
    return IS_LEGACY ? saveLegacy(result.user) : saveV2(result, result.user);
  }, [saveLegacy, saveV2]);

  const request = useCallback(async (operationId, options = {}) => {
    const invoke = () => apiRequest(operationId, { ...options, actor: session.user, accessToken: tokensRef.current.accessToken });
    try { return await invoke(); } catch (error) {
      if (IS_LEGACY || error?.status !== 401 || operationId === "refreshSession") throw error;
      await refresh();
      return invoke();
    }
  }, [refresh, session.user]);

  const logout = useCallback(async () => {
    try {
      if (!IS_LEGACY && tokensRef.current.refreshToken) await apiRequest("logout", {
        accessToken: tokensRef.current.accessToken,
        body: { refreshToken: tokensRef.current.refreshToken },
      });
    } finally { await clearSession(); }
  }, [clearSession]);

  const value = useMemo(() => ({
    ...session, apiProfile: API_PROFILE, legacy: IS_LEGACY, login, logout, request, clearSession,
  }), [clearSession, login, logout, request, session]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
