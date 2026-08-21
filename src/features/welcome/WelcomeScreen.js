import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useSession } from "../../session/SessionProvider";
import { radius, spacing } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";

export function WelcomeScreen() {
  const router = useRouter();
  const { identity, isReady } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const { colors, theme, toggleTheme } = useTheme();
  const styles = makeStyles(colors);
  const labs = t("landing.labs");
  const steps = t("landing.process");
  const destination = identity && isReady ? "/portal" : "/access";

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.topbar}><Text style={styles.brand}>UMG · INGENIERÍA</Text><View style={styles.controls}><Pressable accessibilityRole="button" accessibilityLabel={theme === "dark" ? t("theme.light") : t("theme.dark")} onPress={toggleTheme} style={styles.control}><Text style={styles.controlText}>{theme === "dark" ? "◐" : "◑"}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={t("language.label")} onPress={() => setLanguage(language === "es" ? "en" : "es")} style={styles.control}><Text style={styles.controlText}>{t(`language.${language === "es" ? "en" : "es"}`)}</Text></Pressable></View></View>
    <View style={styles.hero}><Text style={styles.eyebrow}>{t("landing.eyebrow")}</Text><Text accessibilityRole="header" style={styles.title}>{t("landing.title")}</Text><Text style={styles.description}>{t("landing.description")}</Text><Pressable accessibilityRole="button" accessibilityLabel={t("landing.access")} onPress={() => router.navigate(destination)} style={styles.primary}><Text style={styles.primaryText}>{identity && isReady ? t("shell.portal") : t("landing.access")}</Text></Pressable></View>
    <View style={styles.labs}>{labs.map((lab, index) => <View key={lab} style={styles.labCard}><View style={styles.labVisual}><Text style={styles.labCode}>LAB 0{index + 1}</Text><View style={styles.labLine} /><Text style={styles.labIndex}>{String(index + 1).padStart(2, "0")}</Text></View><Text style={styles.labName}>{lab}</Text></View>)}</View>
    <View style={styles.process}><Text style={styles.processTitle}>{t("landing.processTitle")}</Text>{steps.map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</Text><Text style={styles.stepCopy}>{step}</Text></View>)}</View>
  </ScrollView>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  content: { gap: spacing.major, padding: spacing.section, paddingBottom: spacing.major },
  topbar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  brand: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  controls: { flexDirection: "row", gap: spacing.compact },
  control: { alignItems: "center", backgroundColor: colors.control, borderRadius: radius.control, justifyContent: "center", minHeight: 44, minWidth: 44 },
  controlText: { color: colors.brand, fontWeight: "800" },
  hero: { gap: spacing.card, paddingTop: spacing.section },
  eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.3 },
  title: { color: colors.brand, fontSize: 39, fontWeight: "700", letterSpacing: -1.1, lineHeight: 44 },
  description: { color: colors.textSecondary, fontSize: 17, lineHeight: 26, maxWidth: 520 },
  primary: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 50, paddingHorizontal: spacing.section },
  primaryText: { color: colors.onBrand, fontSize: 16, fontWeight: "800" },
  labs: { gap: spacing.control },
  labCard: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, overflow: "hidden" },
  labVisual: { backgroundColor: colors.brand, flexDirection: "row", height: 94, justifyContent: "space-between", padding: spacing.card },
  labCode: { color: colors.onBrand, fontSize: 12, fontWeight: "800", letterSpacing: 1.1 },
  labLine: { alignSelf: "center", backgroundColor: colors.action, height: 1, position: "absolute", right: spacing.card, width: "52%" },
  labIndex: { color: colors.action, fontSize: 32, fontWeight: "800", lineHeight: 32 },
  labName: { color: colors.ink, fontSize: 17, fontWeight: "700", padding: spacing.card },
  process: { backgroundColor: colors.surface, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, gap: spacing.control, padding: spacing.card },
  processTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  step: { alignItems: "center", borderTopColor: colors.borderSoft, borderTopWidth: 1, flexDirection: "row", gap: spacing.control, minHeight: 44, paddingTop: spacing.control },
  stepNumber: { color: colors.action, fontSize: 13, fontWeight: "800", width: 28 },
  stepCopy: { color: colors.textSecondary, flex: 1, fontSize: 15 }
});
