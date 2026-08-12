import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { messageForError } from "../../../api/problem";
import { PageHeader } from "../../../components/PageHeader";
import { Panel } from "../../../components/Panel";
import { ResourceState } from "../../../components/ResourceState";
import { Screen } from "../../../components/Screen";
import { TimeRail } from "../../../components/TimeRail";
import { humanDate } from "../../../lib/format";
import { isAdministrator } from "../../../lib/roles";
import { useSession } from "../../../session/SessionProvider";
import theme from "../../../theme/tokens";

function QuickLink({ href, marker, title, description }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={({ pressed }) => [styles.quickLink, pressed && styles.pressed]}>
        <Text style={styles.quickMarker}>{marker}</Text>
        <View style={styles.quickCopy}>
          <Text style={styles.quickTitle}>{title}</Text>
          <Text style={styles.quickDescription}>{description}</Text>
        </View>
        <Text aria-hidden style={styles.arrow}>›</Text>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const { user, request, legacy, apiProfile } = useSession();
  const [state, setState] = useState({ loading: true, error: "", reservations: [] });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const reservationPage = await request("listReservations", {
        query: { limit: 5, status: "ACTIVE", userId: user.id },
      });
      setState({
        loading: false,
        error: "",
        reservations: reservationPage.items,
      });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: messageForError(error) }));
    }
  }, [request, user.id]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const nextReservation = useMemo(() => state.reservations[0], [state.reservations]);
  const isAdmin = isAdministrator(user);

  return (
    <Screen onRefresh={load} refreshing={state.loading}>
      <PageHeader
        eyebrow="Panel móvil"
        title={`Hola, ${user?.firstName || "docente"}`}
        description="Tus próximos horarios y accesos rápidos en un solo lugar."
      />

      <ResourceState loading={state.loading} error={state.error} onRetry={load}>
        <Panel accessibilityLabel="Próxima reserva" style={styles.heroPanel}>
          <View style={styles.panelHeading}>
            <Text style={styles.eyebrow}>Próxima reserva</Text>
            <Text style={styles.counter}>{state.reservations.length} activas</Text>
          </View>
          {nextReservation ? (
            <>
              <Text style={styles.reservationDate}>{humanDate(nextReservation.date)}</Text>
              <TimeRail startTime={nextReservation.startTime} endTime={nextReservation.endTime} status="active" />
              <Text style={styles.reservationReason}>{nextReservation.reason}</Text>
            </>
          ) : (
            <Text style={styles.empty}>No tienes reservas activas. Consulta un horario disponible.</Text>
          )}
        </Panel>
      </ResourceState>

      <View style={styles.metrics}>
        <Panel style={styles.metric}><Text style={styles.metricNumber}>{state.reservations.length}</Text><Text style={styles.metricLabel}>Reservas activas</Text></Panel>
        <Panel style={styles.metric}><Text style={styles.metricNumber}>{apiProfile.toUpperCase()}</Text><Text style={styles.metricLabel}>Perfil de API</Text></Panel>
      </View>

      {legacy ? (
        <Panel style={styles.legacyPanel} accessibilityLabel="Advertencia de seguridad legacy">
          <Text style={styles.legacyTitle}>Modo legacy sin autenticación</Text>
          <Text style={styles.legacyCopy}>La API actual no protege los datos por identidad. Usa el perfil v2 para autorización en servidor.</Text>
        </Panel>
      ) : null}

      {isAdmin ? (
        <Panel style={styles.adminPanel} accessibilityLabel="Indicador administrativo">
          <Text style={styles.adminTitle}>Supervisión administrativa</Text>
          <Text style={styles.adminCopy}>Tienes visibilidad de actividad urgente aquí. Usuarios y auditoría permanecen en el portal web.</Text>
        </Panel>
      ) : null}

      <View style={styles.quickList}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>Acciones frecuentes</Text>
        <QuickLink href="/(app)/(tabs)/availability" marker="01" title="Buscar disponibilidad" description="Encuentra un laboratorio por fecha y hora." />
        <QuickLink href="/(app)/(tabs)/reservations" marker="02" title="Administrar reservas" description="Modifica o cancela horarios futuros." />
        <QuickLink href="/(app)/(tabs)/profile" marker="03" title="Revisar perfil" description="Consulta tu identidad y cambia tu contraseña." />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroPanel: { borderLeftColor: theme.color.blue, borderLeftWidth: 4 },
  panelHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  eyebrow: { color: theme.color.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  counter: { color: theme.color.muted, fontSize: 12, fontWeight: "700" },
  reservationDate: { color: theme.color.navy, fontFamily: "serif", fontSize: 24, fontWeight: "700", textTransform: "capitalize" },
  reservationReason: { color: theme.color.muted, fontSize: 14, lineHeight: 20 },
  empty: { color: theme.color.muted, fontSize: 14, lineHeight: 21 },
  metrics: { flexDirection: "row", gap: theme.space[3] },
  metric: { flex: 1 },
  metricNumber: { color: theme.color.navy, fontFamily: "serif", fontSize: 28, fontWeight: "700" },
  metricLabel: { color: theme.color.muted, fontSize: 12, lineHeight: 17 },
  adminPanel: { backgroundColor: "#FFF6E5", borderColor: "#E8CC91" },
  adminTitle: { color: "#684609", fontSize: 15, fontWeight: "800" },
  adminCopy: { color: "#765A27", fontSize: 13, lineHeight: 19 },
  legacyPanel: { backgroundColor: "#FFF6E5", borderColor: "#E8CC91" },
  legacyTitle: { color: "#684609", fontSize: 15, fontWeight: "800" },
  legacyCopy: { color: "#765A27", fontSize: 13, lineHeight: 19 },
  quickList: { gap: theme.space[3] },
  sectionTitle: { color: theme.color.navy, fontFamily: "serif", fontSize: 23, fontWeight: "700" },
  quickLink: { alignItems: "center", backgroundColor: theme.color.surface, borderColor: theme.color.border, borderRadius: theme.radius.medium, borderWidth: 1, flexDirection: "row", gap: theme.space[3], minHeight: 76, padding: theme.space[3] },
  quickMarker: { color: theme.color.blue, fontFamily: "monospace", fontSize: 13, fontWeight: "800" },
  quickCopy: { flex: 1, gap: theme.space[1] },
  quickTitle: { color: theme.color.ink, fontSize: 15, fontWeight: "800" },
  quickDescription: { color: theme.color.muted, fontSize: 12, lineHeight: 17 },
  arrow: { color: theme.color.blue, fontSize: 28 },
  pressed: { opacity: 0.7 },
});
