import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../i18n/LanguageProvider";
import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";

export function StatusBanner({ status = "offline" }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const isOffline = status === "offline";
  const text = t(isOffline ? "connection.offline" : "connection.stale");
  const color = isOffline ? colors.warning : colors.action;
  const styles = makeStyles(colors, color);
  return <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.banner}><View style={styles.mark} /><Text style={styles.text}>{text}</Text></View>;
}

const makeStyles = (colors, color) => StyleSheet.create({
  banner: { alignItems: "center", backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: spacing.control, paddingHorizontal: spacing.card, paddingVertical: spacing.compact },
  mark: { backgroundColor: color, borderRadius: 4, height: 8, width: 8 },
  text: { color: colors.textSecondary, flex: 1, fontSize: 13, lineHeight: 18 }
});
