import { useCallback, useEffect, useState } from "react";
import { createRenderApiClient } from "../../api/renderApi";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const todayISO = () => new Date().toISOString().slice(0, 10);

export function selectUpcomingReservations(records, { isAdmin, userId, today = todayISO() }) {
  return asList(records)
    .filter((reservation) => reservation.date >= today && (isAdmin || reservation.userId === userId))
    .sort((left, right) => `${left.date}T${left.startTime}`.localeCompare(`${right.date}T${right.startTime}`))
    .slice(0, 3);
}

export function useUpcomingReservations({ apiFactory = createRenderApiClient, enabled = true, isAdmin, isOnline, userId }) {
  const [state, setState] = useState({ error: null, hasRead: false, reservations: [], status: "loading" });
  const load = useCallback(async () => {
    if (!enabled) return;
    if (!isOnline) {
      setState((current) => ({ ...current, status: current.hasRead ? "stale" : "offline" }));
      return;
    }

    setState((current) => ({ ...current, error: null, status: "loading" }));
    try {
      const api = apiFactory();
      const records = await api.listReservations(isAdmin ? {} : { userId });
      setState({ error: null, hasRead: true, reservations: selectUpcomingReservations(records, { isAdmin, userId }), status: "success" });
    } catch (error) {
      setState((current) => ({ ...current, error, status: "error" }));
    }
  }, [apiFactory, enabled, isAdmin, isOnline, userId]);

  useEffect(() => { load(); }, [load]);
  return { ...state, refresh: load };
}
