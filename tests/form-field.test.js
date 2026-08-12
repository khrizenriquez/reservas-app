import { render } from "@testing-library/react-native";
import { describe, expect, it } from "@jest/globals";
import { createRef } from "react";

import { FormField } from "../src/components/FormField";

describe("form fields", () => {
  it("associates the visible label with the input control", async () => {
    const view = await render(<FormField label="Contraseña" secureTextEntry value="" />);

    expect(view.getByLabelText("Contraseña")).toBeOnTheScreen();
  });

  it("exposes the native input ref for keyboard focus management", async () => {
    const inputRef = createRef();

    await render(<FormField inputRef={inputRef} label="Contraseña" value="" />);

    expect(inputRef.current).toBeTruthy();
  });
});
