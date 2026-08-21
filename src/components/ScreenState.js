import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../i18n/LanguageProvider";
import { radius, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";

export function ScreenState({ kind = "empty", title, description, onRetry }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const labels = { empty: t("states.empty"), error: t("states.error"), loading: t("states.loading") };
  const resolvedTitle = title ?? labels[kind] ?? labels.empty;
  const styles = makeStyles(colors);

  return <View accessibilityRole="summary" accessibilityLabel={resolvedTitle} style={styles.card}>
    <View style={styles.rail}><View style={styles.railMark} /><View style={styles.railMark} /><View style={styles.railMark} /></View>
    <View style={styles.copy}>
      {kind === "loading" ? <ActivityIndicator accessibilityLabel={resolvedTitle} color={colors.action} /> : null}
      <Text style={styles.title}>{resolvedTitle}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {kind === "error" && onRetry ? <Pressable accessibilityRole="button" accessibilityLabel={t("states.retry")} onPress={onRetry} style={styles.button}><Text style={styles.buttonText}>{t("states.retry")}</Text></Pressable> : null}
    </View>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  card: { alignItems: "stretch", backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, flexDirection: "row", minHeight: 132, overflow: "hidden", shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 8 },
  rail: { backgroundColor: colors.brand, justifyContent: "space-around", paddingVertical: spacing.card, width: 12 },
  railMark: { backgroundColor: colors.action, height: 1, opacity: 0.8 },
  copy: { flex: 1, gap: spacing.compact, justifyContent: "center", padding: spacing.card },
  title: { color: colors.ink, fontSize: 18, fontWeight: "700" },
  description: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  button: { alignSelf: "flex-start", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.card },
  buttonText: { color: colors.onBrand, fontWeight: "700" }
});
