import { StyleSheet, Text, View } from "react-native";

import theme from "../theme/tokens";

export function BrandMark({ compact = false }) {
  return (
    <View accessibilityLabel="Reservas UMG" style={styles.row}>
      <View style={[styles.mark, compact && styles.compactMark]}>
        <Text style={[styles.markText, compact && styles.compactMarkText]}>R</Text>
      </View>
      {!compact && (
        <View>
          <Text style={styles.name}>Reservas UMG</Text>
          <Text style={styles.caption}>Laboratorios universitarios</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: theme.space[3] },
  mark: {
    alignItems: "center",
    backgroundColor: theme.color.blue,
    borderRadius: theme.radius.medium,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  compactMark: { borderRadius: theme.radius.small, height: 34, width: 34 },
  markText: { color: theme.color.surface, fontFamily: "serif", fontSize: 28, fontWeight: "700" },
  compactMarkText: { fontSize: 20 },
  name: { color: theme.color.surface, fontFamily: "serif", fontSize: 21, fontWeight: "700" },
  caption: { color: "#C8D9E8", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
});
