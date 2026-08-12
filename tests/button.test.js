import { fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, jest } from "@jest/globals";

import { Button } from "../src/components/Button";

describe("mutation controls", () => {
  it("does not invoke an offline-disabled action", async () => {
    const onPress = jest.fn();
    const view = await render(<Button disabled onPress={onPress}>Crear reserva</Button>);
    fireEvent.press(view.getByRole("button", { name: "Crear reserva" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
