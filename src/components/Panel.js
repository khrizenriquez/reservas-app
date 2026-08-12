import { StyleSheet, View } from "react-native";

import theme from "../theme/tokens";

export function Panel({ children, style, accessibilityLabel }) {
  return <View accessibilityLabel={accessibilityLabel} style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space[3],
    padding: theme.space[4],
  },
});
