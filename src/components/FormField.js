import { StyleSheet, Text, TextInput, View } from "react-native";

import theme from "../theme/tokens";

export function FormField({ label, help, inputRef, multiline = false, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text accessible={false} style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        allowFontScaling
        placeholderTextColor="#7B8792"
        ref={inputRef}
        selectionColor={theme.color.blue}
        style={[styles.input, multiline && styles.multiline]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...inputProps}
      />
      {help ? <Text style={styles.help}>{help}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: theme.space[2] },
  label: { color: theme.color.ink, fontSize: 14, fontWeight: "700" },
  input: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.color.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: theme.space[3],
  },
  multiline: { minHeight: 96, paddingTop: theme.space[3] },
  help: { color: theme.color.muted, fontSize: 12, lineHeight: 17 },
});
