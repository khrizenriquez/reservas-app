import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { messageForError } from "../../../api/problem";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { PageHeader } from "../../../components/PageHeader";
import { Panel } from "../../../components/Panel";
import { ReservationCard } from "../../../components/ReservationCard";
import { ResourceState } from "../../../components/ResourceState";
import { Screen } from "../../../components/Screen";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import { apiTime, shortTime } from "../../../lib/format";
import { useSession } from "../../../session/SessionProvider";
import theme from "../../../theme/tokens";

const filters = [
  ["", "Todas"],
  ["ACTIVE", "Activas"],
  ["CANCELLED", "Canceladas"],
  ["COMPLETED", "Completadas"],
];

export default function ReservationsScreen() {
  const router = useRouter();
  const online = useOnlineStatus();
  const { user, request } = useSession();
  const [filter, setFilter] = useState("ACTIVE");
  const [state, setState] = useState({ loading: true, error: "", reservations: [], labs: [] });
  const [editing, setEditing] = useState(null);
  const [action, setAction] = useState({ busy: false, error: "", success: "" });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [page, labs] = await Promise.all([
        request("listReservations", { query: { limit: 50, status: filter, userId: user.id } }),
        request("listLabs"),
      ]);
      setState({ loading: false, error: "", reservations: page.items, labs });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: messageForError(error) }));
    }
  }, [filter, request, user.id]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const labNames = useMemo(
    () => Object.fromEntries(state.labs.map((lab) => [lab.id, lab.name])),
    [state.labs],
  );

  function startEditing(reservation) {
    setAction({ busy: false, error: "", success: "" });
    setEditing({
      id: reservation.id,
      labId: String(reservation.labId),
      date: reservation.date,
      startTime: shortTime(reservation.startTime),
      endTime: shortTime(reservation.endTime),
      reason: reservation.reason,
    });
  }

  async function saveChanges() {
    setAction({ busy: true, error: "", success: "" });
    try {
      await request("updateReservation", {
        pathParams: { reservationId: editing.id },
        body: {
          labId: Number(editing.labId),
          date: editing.date,
          startTime: apiTime(editing.startTime),
          endTime: apiTime(editing.endTime),
          reason: editing.reason.trim(),
        },
      });
      setEditing(null);
      setAction({ busy: false, error: "", success: "La reserva fue actualizada." });
      await load();
    } catch (error) {
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  async function cancelReservation(reservationId) {
    setAction({ busy: true, error: "", success: "" });
    try {
      await request("cancelReservation", { pathParams: { reservationId } });
      setAction({ busy: false, error: "", success: "La reserva fue cancelada." });
      await load();
    } catch (error) {
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  function confirmCancellation(reservationId) {
    Alert.alert(
      "Cancelar reserva",
      "Esta acción libera el laboratorio y no puede deshacerse.",
      [
        { text: "Conservar", style: "cancel" },
        { text: "Sí, cancelar", style: "destructive", onPress: () => cancelReservation(reservationId) },
      ],
    );
  }

  return (
    <Screen onRefresh={load} refreshing={state.loading}>
      <PageHeader eyebrow="Historial y seguimiento" title="Reservas" description="Consulta, modifica o cancela tus reservas futuras." />
      <View accessibilityLabel="Filtro de reservas" style={styles.filters}>
        {filters.map(([value, label]) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: filter === value }}
            key={value || "all"}
            onPress={() => setFilter(value)}
            style={[styles.filter, filter === value && styles.filterActive]}
          >
            <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {action.error ? <Text accessibilityLiveRegion="assertive" accessibilityRole="alert" style={styles.error}>{action.error}</Text> : null}
      {action.success ? <Text accessibilityLiveRegion="polite" style={styles.success}>{action.success}</Text> : null}

      <ResourceState loading={state.loading} error={state.error} empty={!state.reservations.length} onRetry={load} emptyText="No hay reservas que coincidan con este filtro.">
        <View style={styles.list}>
          {state.reservations.map((reservation) => (
            <ReservationCard
              actions={reservation.status === "ACTIVE" ? (
                <>
                  <Button disabled={!online} onPress={() => startEditing(reservation)} variant="secondary">Modificar</Button>
                  <Button disabled={!online} onPress={() => confirmCancellation(reservation.id)} variant="danger">Cancelar</Button>
                </>
              ) : null}
              key={reservation.id}
              labName={labNames[reservation.labId]}
              onPress={() => router.push(`/(app)/reservation/${reservation.id}`)}
              reservation={reservation}
            />
          ))}
        </View>
      </ResourceState>

      {editing ? (
        <Panel accessibilityLabel={`Modificar reserva ${editing.id}`} style={styles.editor}>
          <View style={styles.editorHeading}><View><Text style={styles.step}>Reserva #{editing.id}</Text><Text accessibilityRole="header" style={styles.editorTitle}>Modificar horario</Text></View><Button onPress={() => setEditing(null)} variant="ghost">Cerrar</Button></View>
          <FormField keyboardType="number-pad" label="Identificador del laboratorio" onChangeText={(labId) => setEditing((current) => ({ ...current, labId }))} value={editing.labId} />
          <FormField keyboardType="numbers-and-punctuation" label="Fecha" onChangeText={(date) => setEditing((current) => ({ ...current, date }))} value={editing.date} />
          <View style={styles.timeFields}>
            <FormField keyboardType="numbers-and-punctuation" label="Desde" onChangeText={(startTime) => setEditing((current) => ({ ...current, startTime }))} style={styles.timeField} value={editing.startTime} />
            <FormField keyboardType="numbers-and-punctuation" label="Hasta" onChangeText={(endTime) => setEditing((current) => ({ ...current, endTime }))} style={styles.timeField} value={editing.endTime} />
          </View>
          <FormField label="Motivo" maxLength={150} multiline onChangeText={(reason) => setEditing((current) => ({ ...current, reason }))} value={editing.reason} />
          <Button disabled={!online || !editing.reason.trim()} loading={action.busy} onPress={saveChanges}>Guardar cambios</Button>
        </Panel>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: theme.space[2] },
  filter: { backgroundColor: theme.color.surface, borderColor: theme.color.border, borderRadius: theme.radius.pill, borderWidth: 1, minHeight: 44, paddingHorizontal: theme.space[3], paddingVertical: theme.space[3] },
  filterActive: { backgroundColor: theme.color.navy, borderColor: theme.color.navy },
  filterText: { color: theme.color.muted, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: theme.color.surface },
  list: { gap: theme.space[3] },
  error: { backgroundColor: "#FFF0F0", borderRadius: theme.radius.small, color: theme.color.danger, padding: theme.space[3] },
  success: { backgroundColor: "#E6F5EF", borderRadius: theme.radius.small, color: "#24664F", padding: theme.space[3] },
  editor: { borderTopColor: theme.color.blue, borderTopWidth: 3 },
  editorHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  step: { color: theme.color.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  editorTitle: { color: theme.color.navy, fontFamily: "serif", fontSize: 22, fontWeight: "700" },
  timeFields: { flexDirection: "row", gap: theme.space[3] },
  timeField: { flex: 1 },
});
