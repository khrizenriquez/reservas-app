import { Pressable, StyleSheet, Text, View } from "react-native";

import { humanDate, statusLabel } from "../lib/format";
import theme from "../theme/tokens";
import { Panel } from "./Panel";
import { TimeRail } from "./TimeRail";

export function ReservationCard({ reservation, labName, actions, onPress }) {
  const content = (
    <Panel style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={styles.date}>{humanDate(reservation.date)}</Text>
          <Text style={styles.lab}>{labName || `Laboratorio ${reservation.labId}`}</Text>
        </View>
        <View style={[styles.status, styles[`status${reservation.status}`]]}>
          <Text style={[styles.statusText, styles[`status${reservation.status}Text`]]}>
            {statusLabel(reservation.status)}
          </Text>
        </View>
      </View>
      <TimeRail
        endTime={reservation.endTime}
        startTime={reservation.startTime}
        status={reservation.status === "ACTIVE" ? "active" : "available"}
      />
      <Text style={styles.reason}>{reservation.reason}</Text>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </Panel>
  );

  if (!onPress) return content;
  return (
    <Pressable
      accessibilityHint="Abre el detalle de la reserva"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.space[3] },
  heading: { alignItems: "flex-start", flexDirection: "row", gap: theme.space[3], justifyContent: "space-between" },
  headingCopy: { flex: 1, gap: theme.space[1] },
  date: { color: theme.color.navy, fontFamily: "serif", fontSize: 20, fontWeight: "700", textTransform: "capitalize" },
  lab: { color: theme.color.muted, fontSize: 13, fontWeight: "700" },
  status: { borderRadius: theme.radius.pill, paddingHorizontal: theme.space[3], paddingVertical: theme.space[1] },
  statusText: { fontSize: 11, fontWeight: "800" },
  statusACTIVE: { backgroundColor: "#E2F0FC" },
  statusACTIVEText: { color: "#155980" },
  statusCANCELLED: { backgroundColor: "#F9E7E7" },
  statusCANCELLEDText: { color: theme.color.danger },
  statusCOMPLETED: { backgroundColor: "#E7F4EF" },
  statusCOMPLETEDText: { color: "#256653" },
  reason: { color: theme.color.ink, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: theme.space[2] },
  pressed: { opacity: 0.72 },
});
