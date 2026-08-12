import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as SecureStore from "expo-secure-store";

import { SESSION_NAMESPACE } from "../src/api/profile";
import { secureSessionStore } from "../src/session/secure-store";

describe("secure mobile session storage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("stores the whole profile session with device-only accessibility", async () => {
    const session = { accessToken: "access", refreshToken: "refresh" };
    await secureSessionStore.setSession(session);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SESSION_NAMESPACE,
      JSON.stringify(session),
      { keychainAccessible: "device-only" },
    );
    expect(SESSION_NAMESPACE).toContain("reservas.mobile.session.");
  });

  it("reads valid JSON and rejects malformed stored state", async () => {
    SecureStore.getItemAsync.mockResolvedValueOnce(JSON.stringify({ user: { id: 3 } }));
    await expect(secureSessionStore.getSession()).resolves.toEqual({ user: { id: 3 } });
    SecureStore.getItemAsync.mockResolvedValueOnce("not-json");
    await expect(secureSessionStore.getSession()).resolves.toBeNull();
  });

  it("clears only the active profile namespace", async () => {
    await secureSessionStore.clearSession();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(SESSION_NAMESPACE);
  });
});
