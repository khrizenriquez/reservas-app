import { StyleSheet, Text, View } from "react-native";

import { shortTime } from "../lib/format";
import theme from "../theme/tokens";

export function TimeRail({ startTime, endTime, status = "available" }) {
  return (
    <View accessibilityLabel={`Horario de ${shortTime(startTime)} a ${shortTime(endTime)}`} style={styles.row}>
      <Text style={styles.time}>{shortTime(startTime)}</Text>
      <View style={styles.rail}>
        <View style={[styles.dot, status === "available" ? styles.available : styles.active]} />
        <View style={[styles.line, status === "available" ? styles.available : styles.active]} />
        <View style={[styles.dot, status === "available" ? styles.available : styles.active]} />
      </View>
      <Text style={styles.time}>{shortTime(endTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: theme.space[2] },
  time: { color: theme.color.ink, fontFamily: "monospace", fontSize: 13, fontWeight: "700" },
  rail: { alignItems: "center", flex: 1, flexDirection: "row" },
  line: { flex: 1, height: 2 },
  dot: { borderRadius: theme.radius.pill, height: 8, width: 8 },
  available: { backgroundColor: theme.color.teal },
  active: { backgroundColor: theme.color.blue },
});
