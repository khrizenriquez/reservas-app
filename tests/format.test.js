import { describe, expect, it } from "@jest/globals";

import { apiTime, shortTime, statusLabel } from "../src/lib/format";

describe("reservation presentation", () => {
  it("normalizes API and display time values", () => {
    expect(apiTime("08:30")).toBe("08:30:00");
    expect(apiTime("08:30:15")).toBe("08:30:15");
    expect(shortTime("17:45:00")).toBe("17:45");
  });

  it("presents each API status as text", () => {
    expect(statusLabel("ACTIVE")).toBe("Activa");
    expect(statusLabel("CANCELLED")).toBe("Cancelada");
    expect(statusLabel("COMPLETED")).toBe("Completada");
  });
});
