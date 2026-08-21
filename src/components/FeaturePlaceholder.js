import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../i18n/LanguageProvider";
import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";
import { ScreenState } from "./ScreenState";

export function FeaturePlaceholder({ titleKey }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  return <View style={styles.screen}>
    <Text style={styles.eyebrow}>{t("shell.identity")}</Text>
    <Text accessibilityRole="header" style={styles.title}>{t(titleKey)}</Text>
    <ScreenState description={t("states.soon")} />
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1, gap: spacing.card, padding: spacing.section },
  eyebrow: { color: colors.action, fontSize: 12, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: colors.ink, fontSize: 30, fontWeight: "700", letterSpacing: -0.5 }
});
