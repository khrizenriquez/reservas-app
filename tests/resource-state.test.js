import { fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, jest } from "@jest/globals";
import { Text } from "react-native";

import { ResourceState } from "../src/components/ResourceState";

describe("resource states", () => {
  it("announces loading", async () => {
    const view = await render(<ResourceState loading><Text>Oculto</Text></ResourceState>);
    expect(view.getByLabelText("Cargando contenido")).toBeOnTheScreen();
  });

  it("shows an actionable error", async () => {
    const retry = jest.fn();
    const view = await render(<ResourceState error="Servicio no disponible" onRetry={retry} />);
    expect(view.getByText("Servicio no disponible")).toBeOnTheScreen();
    fireEvent.press(view.getByRole("button", { name: "Reintentar" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("renders content after loading succeeds", async () => {
    const view = await render(<ResourceState><Text>Reserva disponible</Text></ResourceState>);
    expect(view.getByText("Reserva disponible")).toBeOnTheScreen();
  });
});
