import * as SecureStore from "expo-secure-store";

import { SESSION_NAMESPACE } from "../api/profile";

const options = Object.freeze({ keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });

export const secureSessionStore = Object.freeze({
  async getSession() {
    const value = await SecureStore.getItemAsync(SESSION_NAMESPACE);
    if (!value) return null;
    try { return JSON.parse(value); } catch { return null; }
  },
  setSession(session) {
    return SecureStore.setItemAsync(SESSION_NAMESPACE, JSON.stringify(session), options);
  },
  clearSession() {
    return SecureStore.deleteItemAsync(SESSION_NAMESPACE);
  },
});
