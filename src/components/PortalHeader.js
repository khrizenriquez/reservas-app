import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../i18n/LanguageProvider";
import { useSession } from "../session/SessionProvider";
import { radius, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";

export function PortalHeader() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { signOut } = useSession();
  const { colors, theme, toggleTheme } = useTheme();
  const styles = makeStyles(colors);

  const exit = async () => {
    await signOut();
    router.replace("/access");
  };

  return <View style={styles.header}>
    <View style={styles.row}>
      <View><Text style={styles.brand}>{t("shell.brand")}</Text><Text style={styles.title}>{t("shell.portal")}</Text></View>
      <View style={styles.controls}>
        <Pressable accessibilityRole="button" accessibilityLabel={theme === "dark" ? t("theme.light") : t("theme.dark")} onPress={toggleTheme} style={styles.control}><Text style={styles.controlText}>{theme === "dark" ? "◐" : "◑"}</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t("language.label")} onPress={() => setLanguage(language === "es" ? "en" : "es")} style={styles.control}><Text style={styles.controlText}>{t(`language.${language === "es" ? "en" : "es"}`)}</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t("common.signOut")} onPress={exit} style={styles.control}><Text style={styles.controlText}>↗</Text></Pressable>
      </View>
    </View>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  header: { backgroundColor: colors.surface, borderBottomColor: colors.borderSoft, borderBottomWidth: 1 },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.section, paddingVertical: spacing.control },
  brand: { color: colors.action, fontSize: 11, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: colors.brand, fontSize: 21, fontWeight: "700", letterSpacing: -0.3, marginTop: 2 },
  controls: { flexDirection: "row", gap: spacing.compact },
  control: { alignItems: "center", backgroundColor: colors.control, borderRadius: radius.control, justifyContent: "center", minHeight: 44, minWidth: 44, paddingHorizontal: spacing.compact },
  controlText: { color: colors.brand, fontSize: 13, fontWeight: "800" }
});
