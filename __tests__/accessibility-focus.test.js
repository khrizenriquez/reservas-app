import { focusAccessibilityNode } from "../src/accessibility/focusAccessibilityNode";

describe("native accessibility focus", () => {
  it("resolves a native handle and requests focus", () => {
    const node = {};
    const findNodeHandle = jest.fn(() => 44);
    const setAccessibilityFocus = jest.fn();

    focusAccessibilityNode(node, { findNodeHandle, setAccessibilityFocus });

    expect(findNodeHandle).toHaveBeenCalledWith(node);
    expect(setAccessibilityFocus).toHaveBeenCalledWith(44);
  });

  it("does not request focus when React Native cannot resolve a handle", () => {
    const setAccessibilityFocus = jest.fn();

    focusAccessibilityNode({}, { findNodeHandle: jest.fn(() => null), setAccessibilityFocus });

    expect(setAccessibilityFocus).not.toHaveBeenCalled();
  });
});
