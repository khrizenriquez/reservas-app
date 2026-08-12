import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import theme from "../theme/tokens";
import { Button } from "./Button";

export function ResourceState({ loading, error, empty, onRetry, children, emptyText }) {
  if (loading) {
    return (
      <View accessibilityLabel="Cargando contenido" accessibilityLiveRegion="polite" style={styles.state}>
        <ActivityIndicator color={theme.color.blue} />
        <Text style={styles.copy}>Cargando información…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View accessibilityLiveRegion="assertive" accessibilityRole="alert" style={styles.state}>
        <Text style={styles.title}>No pudimos cargar esta sección</Text>
        <Text style={styles.copy}>{error}</Text>
        {onRetry ? <Button onPress={onRetry} variant="secondary">Reintentar</Button> : null}
      </View>
    );
  }
  if (empty) {
    return (
      <View accessibilityLiveRegion="polite" style={styles.state}>
        <Text style={styles.title}>Aún no hay elementos</Text>
        <Text style={styles.copy}>{emptyText || "La información aparecerá aquí cuando esté disponible."}</Text>
      </View>
    );
  }
  return children;
}

const styles = StyleSheet.create({
  state: {
    alignItems: "center",
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space[3],
    padding: theme.space[6],
  },
  title: { color: theme.color.navy, fontSize: 17, fontWeight: "800", textAlign: "center" },
  copy: { color: theme.color.muted, fontSize: 14, lineHeight: 20, textAlign: "center" },
});
