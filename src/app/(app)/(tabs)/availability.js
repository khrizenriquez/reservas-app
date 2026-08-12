import { randomUUID } from "expo-crypto";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { messageForError } from "../../../api/problem";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { PageHeader } from "../../../components/PageHeader";
import { Panel } from "../../../components/Panel";
import { Screen } from "../../../components/Screen";
import { TimeRail } from "../../../components/TimeRail";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import { apiTime, dateAfter, humanDate } from "../../../lib/format";
import { useSession } from "../../../session/SessionProvider";
import theme from "../../../theme/tokens";

const initialQuery = Object.freeze({ date: dateAfter(1), startTime: "08:00", endTime: "09:00" });

function validateQuery(query) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(query.date)) return "Usa una fecha con formato AAAA-MM-DD.";
  if (!/^\d{2}:\d{2}$/.test(query.startTime) || !/^\d{2}:\d{2}$/.test(query.endTime)) {
    return "Usa horas con formato HH:MM.";
  }
  const minutes = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
  const start = minutes(query.startTime);
  const end = minutes(query.endTime);
  if (start < 420 || end > 1320 || end <= start) return "Elige un intervalo válido entre 07:00 y 22:00.";
  if (end - start > 240) return "Una reserva puede durar como máximo 4 horas.";
  return "";
}

export default function AvailabilityScreen() {
  const { request } = useSession();
  const online = useOnlineStatus();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState({ busy: false, error: "", success: "" });

  async function search() {
    const validationError = validateQuery(query);
    if (validationError) {
      setAction({ busy: false, error: validationError, success: "" });
      return;
    }
    setAction({ busy: true, error: "", success: "" });
    setSelectedLab(null);
    try {
      const labs = await request("getLabAvailability", {
        query: {
          date: query.date,
          startTime: apiTime(query.startTime),
          endTime: apiTime(query.endTime),
        },
      });
      setResults(labs);
      setAction({ busy: false, error: "", success: "" });
    } catch (error) {
      setResults(null);
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  async function reserve() {
    setAction({ busy: true, error: "", success: "" });
    try {
      const reservation = await request("createReservation", {
        headers: { "Idempotency-Key": randomUUID() },
        body: {
          labId: selectedLab.id,
          date: query.date,
          startTime: apiTime(query.startTime),
          endTime: apiTime(query.endTime),
          reason: reason.trim(),
        },
      });
      setSelectedLab(null);
      setReason("");
      setResults(null);
      setAction({ busy: false, error: "", success: `Reserva #${reservation.id} creada correctamente.` });
    } catch (error) {
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Planifica con datos actuales"
        title="Disponibilidad"
        description="Consulta un intervalo y reserva uno de los laboratorios habilitados."
      />

      <Panel accessibilityLabel="Búsqueda de disponibilidad">
        <View style={styles.stepHeading}><Text style={styles.step}>Paso 1</Text><Text style={styles.policy}>07:00–22:00 · máximo 4 h</Text></View>
        <FormField
          accessibilityLabel="Fecha en formato año mes día"
          keyboardType="numbers-and-punctuation"
          label="Fecha"
          onChangeText={(date) => setQuery((current) => ({ ...current, date }))}
          placeholder="AAAA-MM-DD"
          value={query.date}
        />
        <View style={styles.timeFields}>
          <FormField
            accessibilityLabel="Hora de inicio"
            keyboardType="numbers-and-punctuation"
            label="Desde"
            onChangeText={(startTime) => setQuery((current) => ({ ...current, startTime }))}
            placeholder="08:00"
            style={styles.timeField}
            value={query.startTime}
          />
          <FormField
            accessibilityLabel="Hora de finalización"
            keyboardType="numbers-and-punctuation"
            label="Hasta"
            onChangeText={(endTime) => setQuery((current) => ({ ...current, endTime }))}
            placeholder="09:00"
            style={styles.timeField}
            value={query.endTime}
          />
        </View>
        <Button disabled={!online} loading={action.busy} onPress={search}>Consultar horario</Button>
      </Panel>

      {action.error ? <Text accessibilityLiveRegion="assertive" accessibilityRole="alert" style={styles.error}>{action.error}</Text> : null}
      {action.success ? <Text accessibilityLiveRegion="polite" style={styles.success}>{action.success}</Text> : null}

      {results ? (
        <View style={styles.results}>
          <View style={styles.resultsHeading}>
            <View><Text style={styles.step}>Paso 2</Text><Text accessibilityRole="header" style={styles.sectionTitle}>Laboratorios disponibles</Text></View>
            <Text style={styles.count}>{results.length}</Text>
          </View>
          <Text style={styles.summary}>{humanDate(query.date)} · {query.startTime}–{query.endTime}</Text>
          {results.length === 0 ? (
            <Panel><Text style={styles.emptyTitle}>No hay espacios en ese intervalo</Text><Text style={styles.emptyCopy}>Prueba una hora o fecha diferente.</Text></Panel>
          ) : results.map((lab, index) => (
            <Pressable
              accessibilityHint="Selecciona este laboratorio para reservarlo"
              accessibilityRole="button"
              key={lab.id}
              onPress={() => setSelectedLab(lab)}
              style={({ pressed }) => [styles.labCard, selectedLab?.id === lab.id && styles.selected, pressed && styles.pressed]}
            >
              <View style={styles.labHeading}><Text style={styles.number}>{String(index + 1).padStart(2, "0")}</Text><Text style={styles.labName}>{lab.name}</Text></View>
              <TimeRail startTime={query.startTime} endTime={query.endTime} />
              <Text style={styles.available}>● Disponible para reservar</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {selectedLab ? (
        <Panel accessibilityLabel="Confirmación de reserva" style={styles.confirm}>
          <Text style={styles.step}>Paso 3</Text>
          <Text accessibilityRole="header" style={styles.sectionTitle}>Confirma la reserva</Text>
          <Text style={styles.confirmSummary}>{selectedLab.name} · {humanDate(query.date)} · {query.startTime}–{query.endTime}</Text>
          <FormField
            help={`${reason.length}/150 caracteres`}
            label="Motivo de la actividad"
            maxLength={150}
            multiline
            onChangeText={setReason}
            placeholder="Clase, taller o evaluación"
            value={reason}
          />
          <Button disabled={!online || !reason.trim()} loading={action.busy} onPress={reserve}>Confirmar reserva</Button>
          <Button onPress={() => setSelectedLab(null)} variant="secondary">Cambiar laboratorio</Button>
        </Panel>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  step: { color: theme.color.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  policy: { color: theme.color.muted, fontSize: 11, fontWeight: "700" },
  timeFields: { flexDirection: "row", gap: theme.space[3] },
  timeField: { flex: 1 },
  error: { backgroundColor: "#FFF0F0", borderRadius: theme.radius.small, color: theme.color.danger, padding: theme.space[3] },
  success: { backgroundColor: "#E6F5EF", borderRadius: theme.radius.small, color: "#24664F", padding: theme.space[3] },
  results: { gap: theme.space[3] },
  resultsHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { color: theme.color.navy, fontFamily: "serif", fontSize: 22, fontWeight: "700" },
  count: { backgroundColor: "#E7F4EF", borderRadius: theme.radius.pill, color: theme.color.teal, fontWeight: "800", minWidth: 36, padding: theme.space[2], textAlign: "center" },
  summary: { color: theme.color.muted, fontSize: 13 },
  labCard: { backgroundColor: theme.color.surface, borderColor: theme.color.border, borderRadius: theme.radius.medium, borderWidth: 1, gap: theme.space[3], padding: theme.space[4] },
  selected: { borderColor: theme.color.blue, borderWidth: 2 },
  pressed: { opacity: 0.72 },
  labHeading: { alignItems: "center", flexDirection: "row", gap: theme.space[3] },
  number: { color: theme.color.blue, fontFamily: "monospace", fontSize: 12, fontWeight: "800" },
  labName: { color: theme.color.navy, flex: 1, fontSize: 17, fontWeight: "800" },
  available: { color: theme.color.teal, fontSize: 12, fontWeight: "700" },
  confirm: { borderTopColor: theme.color.blue, borderTopWidth: 3 },
  confirmSummary: { color: theme.color.ink, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  emptyTitle: { color: theme.color.navy, fontSize: 16, fontWeight: "800" },
  emptyCopy: { color: theme.color.muted, fontSize: 13 },
});
