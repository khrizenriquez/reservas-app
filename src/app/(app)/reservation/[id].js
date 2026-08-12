import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { messageForError } from "../../../api/problem";
import { Button } from "../../../components/Button";
import { PageHeader } from "../../../components/PageHeader";
import { ReservationCard } from "../../../components/ReservationCard";
import { ResourceState } from "../../../components/ResourceState";
import { Screen } from "../../../components/Screen";
import { humanDateTime } from "../../../lib/format";
import { isAdministrator } from "../../../lib/roles";
import { useSession } from "../../../session/SessionProvider";
import theme from "../../../theme/tokens";

export default function ReservationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { request, user, legacy } = useSession();
  const reservationId = Number(Array.isArray(id) ? id[0] : id);
  const [state, setState] = useState({ loading: true, error: "", reservation: null, labName: "" });

  const load = useCallback(async () => {
    if (!Number.isInteger(reservationId) || reservationId < 1) {
      setState({ loading: false, error: "El identificador de la reserva no es válido.", reservation: null, labName: "" });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [reservation, labs] = await Promise.all([
        request("getReservation", { pathParams: { reservationId } }),
        request("listLabs"),
      ]);
      if (!isAdministrator(user) && reservation.userId !== user.id) {
        setState({
          loading: false,
          error: legacy
            ? "Esta reserva no pertenece al usuario recordado. La API legacy no garantiza protección del dato."
            : "No tienes permiso para consultar esta reserva.",
          reservation: null,
          labName: "",
        });
        return;
      }
      setState({ loading: false, error: "", reservation, labName: labs.find((lab) => lab.id === reservation.labId)?.name || "" });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: messageForError(error) }));
    }
  }, [legacy, request, reservationId, user]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  return (
    <Screen onRefresh={load} refreshing={state.loading}>
      <Button onPress={() => router.back()} variant="ghost">‹ Volver</Button>
      <PageHeader eyebrow={`Reserva #${reservationId || "—"}`} title="Detalle" description="Contexto seguro de tu reserva seleccionada." />
      <ResourceState loading={state.loading} error={state.error} empty={!state.reservation} onRetry={load}>
        {state.reservation ? (
          <>
            <ReservationCard labName={state.labName} reservation={state.reservation} />
            <Text style={styles.metadata}>Creada {humanDateTime(state.reservation.createdAt)}</Text>
          </>
        ) : null}
      </ResourceState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metadata: { color: theme.color.muted, fontSize: 12, textAlign: "center" },
});
