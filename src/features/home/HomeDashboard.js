import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { getRenderErrorMessage } from "../../api/renderApi";
import { StatusBanner } from "../../components/StatusBanner";
import { ScreenState } from "../../components/ScreenState";
import { useConnectivity } from "../../connectivity/ConnectivityProvider";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useSession } from "../../session/SessionProvider";
import { radius, spacing } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { useUpcomingReservations } from "./useUpcomingReservations";

function ReservationCard({ reservation }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <View accessibilityRole="summary" accessibilityLabel={`${reservation.labName} ${reservation.date} ${reservation.startTime}`} style={styles.card}>
    <View style={styles.rail}><Text style={styles.time}>{reservation.startTime?.slice(0, 5)}</Text><View style={styles.line} /><Text style={styles.time}>{reservation.endTime?.slice(0, 5)}</Text></View>
    <View style={styles.cardCopy}><Text style={styles.lab}>{reservation.labName || "—"}</Text><Text style={styles.meta}>{reservation.date}</Text><Text numberOfLines={1} style={styles.reason}>{reservation.reason || "—"}</Text></View>
  </View>;
}

export function HomeDashboard({ apiFactory }) {
  const router = useRouter();
  const { isOnline } = useConnectivity();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { identity, isAdmin, isReady } = useSession();
  const { error, refresh, reservations, status } = useUpcomingReservations({ apiFactory, enabled: Boolean(identity), isAdmin, isOnline, userId: identity?.id });
  const styles = makeStyles(colors);

  if (!isReady || !identity) return <View style={styles.screen}><ScreenState kind="loading" /></View>;

  return <View style={styles.screen}>
    {!isOnline ? <StatusBanner status={reservations.length ? "stale" : "offline"} /> : null}
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>{t("home.greeting")}</Text>
      <Text accessibilityRole="header" style={styles.title}>{isAdmin ? t("home.adminTitle") : t("home.professorTitle")}</Text>
      <Text style={styles.name}>{identity.name}</Text>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{t("home.upcoming")}</Text><Pressable accessibilityRole="button" accessibilityLabel={t("home.refresh")} disabled={!isOnline || status === "loading"} onPress={refresh} style={styles.refresh}><Text style={styles.refreshText}>↻</Text></Pressable></View>
      {status === "loading" ? <ScreenState kind="loading" /> : null}
      {status === "error" ? <ScreenState description={error?.code ? getRenderErrorMessage(error) : t("home.error")} kind="error" onRetry={refresh} title={t("home.error")} /> : null}
      {status === "offline" ? <ScreenState title={t("home.noReservations")} /> : null}
      {status !== "loading" && status !== "error" && status !== "offline" && reservations.length === 0 ? <ScreenState /> : null}
      {reservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)}
      <Pressable accessibilityRole="button" accessibilityLabel={t("home.availability")} onPress={() => router.navigate("/portal/availability")} style={styles.primary}><Text style={styles.primaryText}>{t("home.availability")}</Text></Pressable>
    </ScrollView>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  content: { gap: spacing.card, padding: spacing.section },
  eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: colors.brand, fontSize: 30, fontWeight: "700", letterSpacing: -0.6, marginTop: -4 },
  name: { color: colors.textSecondary, fontSize: 16, marginTop: -10 },
  sectionHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: spacing.compact },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: "700" },
  refresh: { alignItems: "center", backgroundColor: colors.control, borderRadius: radius.control, justifyContent: "center", minHeight: 44, minWidth: 44 },
  refreshText: { color: colors.action, fontSize: 18, fontWeight: "800" },
  card: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, flexDirection: "row", overflow: "hidden" },
  rail: { alignItems: "center", backgroundColor: colors.brand, justifyContent: "space-between", minHeight: 104, paddingVertical: spacing.control, width: 68 },
  time: { color: colors.onBrand, fontSize: 12, fontWeight: "800" },
  line: { backgroundColor: colors.action, height: 1, width: 28 },
  cardCopy: { flex: 1, gap: spacing.micro, justifyContent: "center", padding: spacing.card },
  lab: { color: colors.ink, fontSize: 17, fontWeight: "700" },
  meta: { color: colors.action, fontSize: 14, fontWeight: "700" },
  reason: { color: colors.textSecondary, fontSize: 14 },
  primary: { alignItems: "center", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 48, marginTop: spacing.compact, paddingHorizontal: spacing.card },
  primaryText: { color: colors.onBrand, fontSize: 16, fontWeight: "800" }
});
