import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider } from "../session/SessionProvider";
import theme from "../theme/tokens";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <View style={styles.root}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: styles.content }} />
        </View>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: theme.color.paper, flex: 1 },
  content: { backgroundColor: theme.color.paper },
});
