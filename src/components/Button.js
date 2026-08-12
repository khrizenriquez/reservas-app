import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import theme from "../theme/tokens";

export function Button({
  children,
  disabled = false,
  loading = false,
  onPress,
  variant = "primary",
  accessibilityHint,
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? theme.color.surface : theme.color.navy} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderColor: theme.color.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
  },
  primary: { backgroundColor: theme.color.blue, borderColor: theme.color.blue },
  secondary: { backgroundColor: theme.color.surface },
  danger: { backgroundColor: "#FFF3F3", borderColor: "#E6BABA" },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" },
  disabled: { opacity: 0.48 },
  pressed: { opacity: 0.72 },
  label: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  primaryLabel: { color: theme.color.surface },
  secondaryLabel: { color: theme.color.navy },
  dangerLabel: { color: theme.color.danger },
  ghostLabel: { color: theme.color.blue },
});
