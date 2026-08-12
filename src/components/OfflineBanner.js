import { StyleSheet, Text, View } from "react-native";

import theme from "../theme/tokens";

export function OfflineBanner({ online }) {
  if (online) return null;
  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.banner}>
      <Text style={styles.text}>Sin conexión · los datos visibles pueden estar desactualizados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFF4DC",
    borderBottomColor: "#E7C47F",
    borderBottomWidth: 1,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[2],
  },
  text: { color: "#6E4B0B", fontSize: 13, fontWeight: "700", textAlign: "center" },
});
