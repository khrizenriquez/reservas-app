import { AccessibilityInfo, findNodeHandle } from "react-native";

export function focusAccessibilityNode(node, dependencies = {}) {
  const resolveNodeHandle = dependencies.findNodeHandle ?? findNodeHandle;
  const setAccessibilityFocus = dependencies.setAccessibilityFocus ?? AccessibilityInfo.setAccessibilityFocus;
  if (!node || !setAccessibilityFocus) return;

  const nodeHandle = resolveNodeHandle(node);
  if (nodeHandle) setAccessibilityFocus(nodeHandle);
}
