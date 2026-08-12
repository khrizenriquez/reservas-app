import { act, render, waitFor } from "@testing-library/react-native";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { useEffect } from "react";
import { Text } from "react-native";

import { apiRequest } from "../src/api/client";
import { IS_LEGACY } from "../src/api/profile";
import { SessionProvider, useSession } from "../src/session/SessionProvider";
import { secureSessionStore } from "../src/session/secure-store";

jest.mock("../src/api/client", () => ({ apiRequest: jest.fn() }));
jest.mock("../src/session/secure-store", () => ({
  secureSessionStore: {
    clearSession: jest.fn(() => Promise.resolve()),
    getSession: jest.fn(() => Promise.resolve(null)),
    setSession: jest.fn(() => Promise.resolve()),
  },
}));

function SessionProbe({ onChange }) {
  const session = useSession();
  useEffect(() => onChange(session), [onChange, session]);
  return <Text>{session.status}</Text>;
}

async function renderSession(onChange) {
  await render(<SessionProvider><SessionProbe onChange={onChange} /></SessionProvider>);
}

describe(`mobile ${IS_LEGACY ? "legacy" : "v2"} session provider`, () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    jest.clearAllMocks();
    secureSessionStore.getSession.mockResolvedValue(null);
  });

  it("stores credentials in the profile-specific secure namespace", async () => {
    const user = { id: 7, firstName: "Ana", lastName: "López" };
    const response = IS_LEGACY
      ? { user, legacy: true }
      : { accessToken: "access-1", refreshToken: "refresh-1", user };
    apiRequest.mockResolvedValueOnce(response);
    let context;
    await renderSession((value) => { context = value; });
    await waitFor(() => expect(context.status).toBe("anonymous"));

    await act(() => context.login({ username: "ana@umg.edu.gt", password: "safe-password" }));

    expect(apiRequest).toHaveBeenCalledWith("login", {
      body: { username: "ana@umg.edu.gt", password: "safe-password" },
    });
    expect(secureSessionStore.setSession).toHaveBeenCalledWith(
      IS_LEGACY ? { user } : { accessToken: "access-1", refreshToken: "refresh-1" },
    );
    expect(context).toMatchObject({ status: "authenticated", user });
  });

  const refreshTest = IS_LEGACY ? it.skip : it;
  refreshTest("performs one refresh and retries once after a 401", async () => {
    const user = { id: 7, firstName: "Ana", lastName: "López" };
    const unauthorized = Object.assign(new Error("expired"), { status: 401 });
    apiRequest.mockImplementation((operationId, options) => {
      if (operationId === "login") return Promise.resolve({ accessToken: "access-1", refreshToken: "refresh-1", user });
      if (operationId === "refreshSession") return Promise.resolve({ accessToken: "access-2", refreshToken: "refresh-2" });
      if (operationId === "getCurrentUser") return Promise.resolve(user);
      if (operationId === "listLabs" && options.accessToken === "access-2") return Promise.resolve([{ id: 1, name: "Lab 1" }]);
      return Promise.reject(unauthorized);
    });
    let context;
    await renderSession((value) => { context = value; });
    await waitFor(() => expect(context.status).toBe("anonymous"));
    await act(() => context.login({ username: "ana@umg.edu.gt", password: "safe-password" }));

    let labs;
    await act(async () => { labs = await context.request("listLabs"); });
    expect(labs).toEqual([{ id: 1, name: "Lab 1" }]);
    expect(secureSessionStore.setSession).toHaveBeenLastCalledWith({ accessToken: "access-2", refreshToken: "refresh-2" });
    expect(apiRequest).toHaveBeenLastCalledWith("listLabs", expect.objectContaining({ accessToken: "access-2" }));
  });
});
