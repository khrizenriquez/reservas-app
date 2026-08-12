import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useSession } from "../../session/SessionProvider";
import theme from "../../theme/tokens";

export default function AuthenticatedLayout() {
  const { status, user } = useSession();
  if (status === "booting") {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.color.blue} size="large" />
      </View>
    );
  }
  if (status !== "authenticated") return <Redirect href="/login" />;
  if (user?.mustChangePassword) return <Redirect href="/change-password" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", flex: 1, justifyContent: "center" },
});
