import { Redirect } from "expo-router";
import { ScreenState } from "../../src/components/ScreenState";
import { UsersScreen } from "../../src/features/users/UsersScreen";
import { useSession } from "../../src/session/SessionProvider";

export default function PortalUsersScreen() {
  const { isAdmin, isReady } = useSession();
  if (!isReady) return <ScreenState kind="loading" />;
  if (!isAdmin) return <Redirect href="/portal/administration" />;
  return <UsersScreen />;
}
