import { render, screen } from "@testing-library/react-native";
import { AppShell } from "../src/components/AppShell";
import { tokens } from "../src/theme/tokens";

describe("AppShell", () => {
  it("renders the native project baseline", async () => {
    await render(<AppShell />);

    expect(screen.getByRole("header", { name: "UMG · INGENIERÍA" })).toBeTruthy();
    expect(screen.getByText("Reservas UMG")).toBeTruthy();
    expect(tokens.academicNavy).toBe("#17355F");
  });
});
