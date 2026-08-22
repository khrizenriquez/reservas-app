import { Redirect } from "expo-router";
import { ScreenState } from "../../src/components/ScreenState";
import { LogsScreen } from "../../src/features/logs/LogsScreen";
import { useSession } from "../../src/session/SessionProvider";

export default function PortalLogsScreen() {
  const { isAdmin, isReady } = useSession();
  if (!isReady) return <ScreenState kind="loading" />;
  if (!isAdmin) return <Redirect href="/portal/administration" />;
  return <LogsScreen />;
}
