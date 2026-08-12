import { describe, expect, it } from "@jest/globals";

import { isAdministrator, MOBILE_ADMIN_SCOPE } from "../src/lib/roles";

describe("role-aware mobile scope", () => {
  it("shows urgent indicators only to administrators", () => {
    expect(isAdministrator({ role: { name: "ADMIN" } })).toBe(true);
    expect(isAdministrator({ role: { name: "DOCENTE" } })).toBe(false);
  });

  it("leaves dense configuration and reporting on the web", () => {
    expect(MOBILE_ADMIN_SCOPE).toEqual({
      urgentIndicators: true,
      denseConfiguration: false,
      auditBuilder: false,
      reportBuilder: false,
    });
  });
});
