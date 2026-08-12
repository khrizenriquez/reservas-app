import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useSession } from "../session/SessionProvider";
import theme from "../theme/tokens";

export default function EntryScreen() {
  const { status } = useSession();
  if (status === "booting") {
    return (
      <View accessibilityLabel="Restaurando sesión segura" style={styles.loading}>
        <ActivityIndicator color={theme.color.blue} size="large" />
      </View>
    );
  }
  return <Redirect href={status === "authenticated" ? "/(app)/(tabs)" : "/login"} />;
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", backgroundColor: theme.color.paper, flex: 1, justifyContent: "center" },
});
